// import jsPDF from "jspdf";
// import "jspdf-autotable";

// export const bagStickerSet = () => {
//   const doc = new jsPDF({
//     orientation: "l",
//     unit: "in",
//     format: [2, 4],
//   });

//   doc.setFontSize(14);
//   doc.text(`Baguette - P (lg. fridge)`, 0.2, 0.36);
//   doc.setFontSize(10);
//   doc.text(`65 lb. Batch`, 2.9, 0.36);
//   doc.setFontSize(12);
//   doc.text(`Bread Flour`, 1.2, 0.8);
//   doc.text(`10.87`, 0.3, 0.8);
//   doc.text(`lb.`, 0.8, 0.8);
//   doc.text(`Water`, 1.2, 1.04);
//   doc.text(`10.87`, 0.3, 1.04);
//   doc.text(`lb.`, 0.8, 1.04);
//   doc.text(`Yeast`, 1.2, 1.28);
//   doc.text(`.08`, 0.3, 1.28);
//   doc.text(`lb.`, 0.8, 1.28);

//   doc.addPage({
//     format: [2, 4],
//     orientation: "l",
//   });

//   doc.setFontSize(14);
//   doc.text(`Baguette - L (med. room temp)`, 0.2, 0.36);
//   doc.setFontSize(10);
//   doc.text(`65 lb. Batch`, 2.9, 0.36);
//   doc.setFontSize(12);
//   doc.text(`Bread Flour`, 1.2, 0.8);
//   doc.text(`5.97`, 0.3, 0.8);
//   doc.text(`lb.`, 0.8, 0.8);
//   doc.text(`Water`, 1.2, 1.04);
//   doc.text(`5.97`, 0.3, 1.04);
//   doc.text(`lb.`, 0.8, 1.04);
//   doc.text(`Starter`, 1.2, 1.28);
//   doc.text(`1`, 0.3, 1.28);
//   doc.text(`cup`, 0.8, 1.28);

//   doc.addPage({
//     format: [2, 4],
//     orientation: "l",
//   });

//   doc.setFontSize(14);
//   doc.text(`Baguette - Dry (lg. room temp)`, 0.2, 0.36);
//   doc.setFontSize(10);
//   doc.text(`65 lb. Batch`, 2.9, 0.36);
//   doc.setFontSize(12);
//   doc.text(`Bread Flour`, 1.2, 0.8);
//   doc.text(`19.90`, 0.3, 0.8);
//   doc.text(`lb.`, 0.8, 0.8);
//   doc.text(`Whole Wheat Flour`, 1.2, 1.04);
//   doc.text(`2.48`, 0.3, 1.04);
//   doc.text(`lb.`, 0.8, 1.04);
//   doc.text(`Salt`, 1.2, 1.28);
//   doc.text(`.83`, 0.3, 1.28);
//   doc.text(`lb.`, 0.8, 1.28);

//   doc.addPage({
//     format: [2, 4],
//     orientation: "l",
//   });

//   doc.setFontSize(14);
//   doc.text(`Baguette - Wet (sm. fridge)`, 0.2, 0.36);
//   doc.setFontSize(10);
//   doc.text(`65 lb. Batch`, 2.9, 0.36);
//   doc.setFontSize(12);
//   doc.text(`Water`, 1.2, 0.8);
//   doc.text(`7.96`, 0.3, 0.8);
//   doc.text(`lb.`, 0.8, 0.8);

//   doc.addPage({
//     format: [2, 4],
//     orientation: "l",
//   });

//   doc.setFontSize(14);
//   doc.text(`Baguette - Yeast`, 0.2, 0.36);
//   doc.setFontSize(10);
//   doc.text(`65 lb. Batch`, 2.9, 0.36);
//   doc.setFontSize(12);
//   doc.text(`Yeast`, 1.2, 0.8);
//   doc.text(`.12`, 0.3, 0.8);
//   doc.text(`lb.`, 0.8, 0.8);

//   doc.save(`BaguetteStickers.pdf`);
// };
