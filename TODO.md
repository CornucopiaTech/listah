# To Do

- Fix frontend pagination navigation
	- Let the backend make sure that data is sent when the frontend asks for a page that is outside the maximum page count.
	- Send two requests for the paginated record and the total number of records that match the query so front end pagination will never ask for data that is outside the page limit.
