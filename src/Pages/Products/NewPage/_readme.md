# Intro

The Products page is similar to the Locations page, but attempts to generate
table and form content with more generic code that can generate content in a
more dynamic/automatic way. This doesn't reduce complexity necessarily,
especially when data isn't handled in a cookie-cutter fashion. Rather, this 
approach just forces us to move all that complexity somewhere outside the
component. 

This can be a good thing -- all the configuration stuff will tend
to be grouped into focused spaces that allow you to tweak the page's behvaior
without having to slog through bloated JSX code.

The downside is that this configuration stuff probably works through some
kind of custom interface with the generic page-generating code, the rules
of which may not be obvious.

# Overview

The product page's core function is to manage Product table data through form
submission. We use the popular formik/yup combo to lend some consistent
structure to our code.

Making a reliable form requires some pretty painstaking foundation work in 
setting up form validation rules in the yup schema. However once that is in 
place, we end up with an object that does a pretty darn good job of describing 
our data. Off the bat, the schema can tell us what fields are in our
table and what data type each field value has, so we can refer to the schema
when we want to, say, dynamically generate a table body with different templates
for, say, text data vs boolean data. 

We can further lean into yup's .meta feature, imbuing the schema & each field 
with as rich of a description as we like. This allows us to apply custom rules 
for handling a particular field when specifed, and fall back to more 
generic/cookie-cutter rules when not.

This extends the schema to a model for the page as a whole. I'm not 100% as to
how I feel about that, but it certainly is convenient to write.

# Adding to the page

## Adding a new attribute to the AppSync table

- When updating the Product Table in the AppSync schema, be sure to update
the corresponding custom query called by useListData so that all data gets
fetched.

- Add the field to the yup shema in ./schema.js, making sure to add all the
validation rules and a category property to the field's meta object. If you're
making a new category and want it to be displayed, make sure the field is
listed in the overall schema's metadata in the 'categories' property.

## Adding a special display template for a column in the DataTable component

The page supports custom templates for table column bodies, which are collected
in ./TableTemplates.jsx. 

- Define a new template there 
- Add it to the exported bodyTemplates object following the established pattern. 
  Keying the template by a field's name will ensure the template will be used on 
  that column.

Some generic templates are provided to apply by data-type. You can edit those
to tweak the generic behavior of the table.

## Adding a special form input

This setup is similar to the table body templates. Form input components
are collected in ./FormInputs.jsx. They are designed to work with formik and
display validation errors. You can define a new input there and list it in the
exported 'formInputs' object. If you want a field to use your input, you can
use the field's name as the input's key in 'formInputs'. 

Alternatively you can use a generic key name, then direct the field to use that 
input by specifying the key in the field's .meta.input.name value. This feels a
bit janky as it doesn't mirror the table template setup, but here we are.

# Other Features

Some customization features not mentioned yet revolve around yup's 'context',
which allows the schema to follow different rules depending on some value. This 
lets us use the same schema in both 'create' and 'update' contexts. We piggyback
off this passed value to define other custom behavior. In particular, we can
disable editing 'immutable' fields on update (like the primary key value).

When our field has enumerated values and we want to use a dropdown/multiselect
input, we need to pass the correct options to the generic component. We achieve 
this by specifying the options in the field's .meta.input.props.options.
These components are not used by default and would need to be specified as
described above in 'adding a special form input'.

Hopefully this illustrates how easy it is to run amok and abuse yup's 
metadata object. In the moment it's very easy to cook up a new property and
use it to inject some custom behavior into the page, but if we forget how
these properties work, the code will degrade into the same jumbled mess that
a naive, 'hard-code-everything' approach would result in.

# Future Features

We could hold nearly any custom prop in our metadata space: any specific
primereact component prop values, styles, etc... but again the fear is that 
throwing so much onto the pile would make things unmaintainable. 