# To Do
- Consider adding category filter and tag filter to the drawer for  page listing items for only a particular tag or category.
- Add breadcrumbs for ease of navigation
- Explore using middleware to set the userId
- Add capability to delete items
  - Add select item capability
  - Add functionality to mark selected item as as deleted
- Add capability to delete multiple items
- Keep a navigation arrow to quickly scroll to the top or the bottom of the page.
- Send auth token with api request
- Add auth token to the query key for all api requests
- Add logo instead of app name in the navbar
- configure api to read the auth token in the web app request
- configure api to verify the auth token in the api request
- Figure out how to deploy using Kubernetes
- Calculate the size of the Virtuoso height from the pageSize and a fixed size per row of the table.
- Add capability to add new property
- Add capability to delete property
- Send error message when server side mutation fails.



# Done
- Define home page. Redirect to /categories
- Define categories page as a list of categories and each category can be clicked to get a list of items in the category.
- Define tag page as a list of tags and each tag can be clicked to get a list of items in the tag.
- Add capability to add new item from category page. Let the new item inherit the category from the route query. : Done in modal
- Add capability to add new item from tag page. Let the new item inherit the tag from the route query. : Done in Modal
- Closing the modal should refresh the page and get the new changes to that were made. : query invalidation at successful submission.

- Add capability to delete tag:: Added clear button
- Add capability to delete multiple tags:: Added clear button
- Add mechanism to add new items :: Updated Dialog to add this functionality
- Add capability to add new tag :: Updated Dialog to add this functionality
- Add feedback when form is submitted for adding new item or updating an item. :: Added success alert.
- Define mutation to update item view page
- Add a signin button in the uauthorised page page.
- Add consistency to navbar in the 40* pages.
- Fix the bug that does not allow 'other', 'skean' and 'label' to display in items content : It was not a bug. The pagination was messing with the separation of items by category. This has been reverted.
- Adjust pagination on a per-category basis :: Not done because of the needless complexity.
- Define a modal for creating new items. :: Defined Dialog that displays items
- Define item view page :: Defined Dialog that displays items
- Define the entire content of the item listing inside the link tag. :: Use Dialog box and set background on hover.
