# Listah

Each item should have only one tag.
This choice is made to prevent a case where a new item is created, it can map to an existing tag and the tag id can be stored as an attribute in the item.
Storing the tag id as an attribute is relevant because it allows for the name of the tag to be changed at a later date and the tag name is not the primary key for the tag.
If multiple tags are allowed on a document and a new item is added to the collection that does not have an existing entry in the tags collection, an entry can be created for that tag and its id can be stored for the item. But if multiple tags are allowed for an item, it becomes difficult to figure out which particular tag does not exist in the db.
Saved Filters should be a way for getting multiple tags
