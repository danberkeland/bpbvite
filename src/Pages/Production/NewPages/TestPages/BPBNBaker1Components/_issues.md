CALCULATING DOUGHS:

	1. Calculating dough needed:
	
		CURRENT:
		Current code measures needed dough by first looking at dough.isBakeReady. If the attribute is true, we look at T+1 prod orders, else T+2. Then we filter orders to products with a matching dough type, and sum over each order's qty * weight * packSize.
		
		ISSUES:
		In other production calculations, we consider orders over  a two day interval. For example...
		
			In BPBNBaker1's first "What to Bake" section we get totals by looking at orders for T+0 that CAN be baked and delivered the same day, and at orders for T+1 that  CANNOT be baked and delivered the same day.
			
			BPBNBaker1's "What to Prep" section counts the same way, except for T+1 and T+2.
			
		Should the dough calculations also look forward a day to catch orders that cannot be baked and delivered the same day?
		
		IN THE CODE:
		The spot in question is...
		
			src > Pages > Production > Utils > composeDough.js 
				> ComposeDough > returnDoughs
			
		at line 201, where the code calculates the "needed" value by choosing to sum over either the T+1 or T+2 list.

		PROPOSED CHANGES
		I think we should instead choose to sum over either T+1 & T+2, or T+2 & T+3, filtering the first list to orders that can be baked/delivered on the same day, and filtering the second to orders that can't be baked/delivered on the same day.



	2. Calculating preshaped dough:

		CURRENT:
		Preshaped dough weight is calculated by summing over a (filtered) order list, summing order.product.preshaped * order.product.weight * order.product.packSize.

		ISSUES
		a product's preshaped qty is not measured out per order. It is a total qty, not just for a single product, but a total across all products that use the given preshape type (I think? That sounds most reasonable to me).

		It's hard to say which final products are counted together to get preshape count, but in the BaguetteMix page, 'What to Make' section, 'the pocket count' seems to be assigned to products by their 'forBake' value.  That is, all products with the same 'forBake' get the same 'preshaped' value.  

		As far as Baguette dough calculations go, we can probably use this as a guide, but I don't believe 'forBake' will be enough to track preshapes of french products. For example, dutch sticks and french sticks have the same preshape, but might not have the same 'forBake' name.

		IN THE CODE:
		The spot in question is...

			src > Pages > Production > Utils > composeDough.js 
				ComposeDough > returnDoughs

		We calculate the preshaped dough on lines 212 to 223, calling 'getPreshapedDoughAmt' (lines 254 to 263) where the order list gets mapped to an array of preshaped * weight * packSize values, then summed.

		PROPOSED CHANGES:
		We shouldn't iterate over orders as that will count the same preshaped total several times over. We want to count only 1 of each preshaped value for each 'preshaped type' (however that's defined) for the given dough type.

		Again, going off of other code in BPBNBaker1, it looks like we can pick one preshaped value from any product with the same forBake value.

	3. Calculating Weight:

		ISSUE: weight calculation no multiplying by packSize. Applies to baguette dough only, but this will cause undercounting needed dough for mbag since packSize is 6.

		In THE CODE:

			src > Pages > Production > Utils > composeDough.js > ComposeDough

				> returnBagDoughTwoDays at line 87

	