Eat-n-split


This is a simple React application designed to manage and split bills with friends. Users can add friends, edit and delete friend details, and calculate expenses to maintain a balance of what is owed or owed to them.

Features


Add Friends: Easily add new friends by providing a name and image URL.

Edit Friend Details: Update a friend's name or image.

Delete Friend: Remove friends from the list.

Balance Tracking: Keep track of debts with each friend.

Bill Splitting: Split bills with selected friends and adjust the balance accordingly.


Tech Stack

React: For building user interfaces and managing component state.

PropTypes: Used to validate props passed between components for data integrity.



Components Overview

App: The main component that holds the state and renders child components.

FriendList: Lists friends with their details and allows selection, editing, and deletion.

Friend: Displays an individual friend’s information and balance status.

Button: Reusable button component for various actions.

FormAddFriend: A form for adding new friends.

FormSplitBill: A form to enter bill information and calculate the split with a selected friend.


Prop Validation: Each component utilizes PropTypes to ensure accurate prop validation for enhanced reliability.



Usage
Add a Friend:

Click the "Add Friend" button.
Enter the friend's name and image URL, then click "Add."
Select a Friend:

Click on a friend's "Select" button to split a bill with them.
Split a Bill:

Enter the bill amount, specify how much each party is paying, and select the payer.
Click "Split Bill" to update balances accordingly.
Edit or Delete a Friend:

Use "Edit" to modify a friend's details or "Delete" to remove them from the list.
