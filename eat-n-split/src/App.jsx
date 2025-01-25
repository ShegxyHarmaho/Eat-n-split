import { useState } from "react";
import PropTypes from "prop-types";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const totalBalance = friends.reduce((acc, friend) => acc + friend.balance, 0);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSelection(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  function handleDeleteFriend(id) {
    setFriends((friends) => friends.filter((friend) => friend.id !== id));
    setSelectedFriend(null);
  }

  function handleEditFriend(updatedFriend) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === updatedFriend.id ? updatedFriend : friend
      )
    );
    setSelectedFriend(updatedFriend);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <h2>Total Balance: ${totalBalance}</h2>
        <FriendList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
          onDeleteFriend={handleDeleteFriend}
          onEditFriend={handleEditFriend}
        />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}key={selectedFriend.id}
        />
      )}
    </div>
  );
}

App.propTypes = {
  initialFriends: PropTypes.array,
};

function FriendList({
  friends,
  onSelection,
  selectedFriend,
  onDeleteFriend,
  onEditFriend,
}) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
          onDeleteFriend={onDeleteFriend}
          onEditFriend={onEditFriend}
        />
      ))}
    </ul>
  );
}

FriendList.propTypes = {
  friends: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      balance: PropTypes.number.isRequired,
    })
  ).isRequired,
  onSelection: PropTypes.func.isRequired,
  selectedFriend: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    image: PropTypes.string,
    balance: PropTypes.number,
  }),
  onDeleteFriend: PropTypes.func.isRequired,
  onEditFriend: PropTypes.func.isRequired,
};

function Friend({
  friend,
  onSelection,
  selectedFriend,
  onDeleteFriend,
  onEditFriend,
}) {
  const isSelected = selectedFriend?.id === friend.id;
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(friend.name);
  const [editImage, setEditImage] = useState(friend.image);

  function handleEditSubmit(e) {
    e.preventDefault();
    const updatedFriend = { ...friend, name: editName, image: editImage };
    onEditFriend(updatedFriend);
    setIsEditing(false);
  }

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={`Profile picture of ${friend.name}`} />
      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <input
            type="text"
            value={editImage}
            onChange={(e) => setEditImage(e.target.value)}
          />
          <Button>Save</Button>
        </form>
      ) : (
        <>
          <h3>{friend.name}</h3>
          {friend.balance < 0 && (
            <p className="red">
              You owe {friend.name} ${Math.abs(friend.balance)}
            </p>
          )}
          {friend.balance > 0 && (
            <p className="green">
              {friend.name} owes you ${Math.abs(friend.balance)}
            </p>
          )}
          {friend.balance === 0 && <p>You and {friend.name} are even</p>}

          <Button onClick={() => onSelection(friend)}>
            {isSelected ? "Close" : "Select"}
          </Button>
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
          <Button onClick={() => onDeleteFriend(friend.id)}>Delete</Button>
        </>
      )}
    </li>
  );
}

Friend.propTypes = {
  friend: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    balance: PropTypes.number.isRequired,
  }).isRequired,
  onSelection: PropTypes.func.isRequired,
  selectedFriend: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    image: PropTypes.string,
    balance: PropTypes.number,
  }),
  onDeleteFriend: PropTypes.func.isRequired,
  onEditFriend: PropTypes.func.isRequired,
};

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();

    const newFriend = {
      id,
      name,
      image: `${image}?u=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👨🏿‍🤝‍👨🏼 Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🖼 Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

FormAddFriend.propTypes = {
  onAddFriend: PropTypes.func.isRequired,
};

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🧍‍♂️ Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />

      <label>👨🏿‍🤝‍👨🏼 {selectedFriend.name}'s expense</label>
      <input type="text" disabled value={paidByFriend} />

      <label>🤑 Who is paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}

FormSplitBill.propTypes = {
  selectedFriend: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    balance: PropTypes.number.isRequired,
  }).isRequired,
  onSplitBill: PropTypes.func.isRequired,
};
