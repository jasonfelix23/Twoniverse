import React from "react";

const SideBar = () => {
  return (
    <div className="w-1/4 bg-greendark3 text-white/200 p-4">
      <h2 className="text-lg font-bold mb-4">Menu</h2>
      <div>
        <h3 className="font-semibold">Chat</h3>
        {/* Stub for chat */}
        <p>Chat functionality will go here.</p>
      </div>
      <div>
        <h3 className="font-semibold">Online Users</h3>
        {/* Stub for online users */}
        <p>List of online users will go here.</p>
      </div>
    </div>
  );
};

export default SideBar;
