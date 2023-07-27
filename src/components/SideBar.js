import React from "react";
import { Button } from "@aws-amplify/ui-react";
export default function SideBar({
  handleAddNote,
  handleShowAllNotes,
  signOut,
}) {
  return (
    <div>
      {" "}
      <div className="sidebar">
        <div className="logo">
          <img
            src="https://studytub.netlify.app/img/core-img/nanda.webp"
            alt="studytub logo"
          />
          <span>Studytub</span>
        </div>
        <ul className="nav-links">
          <li>
            <Button variation="link" onClick={handleShowAllNotes}>
              All Notes
            </Button>
          </li>
          <li>
            <Button variation="link" onClick={handleAddNote}>
              Add your Note
            </Button>
          </li>
        </ul>
        <div className="separator"></div>
        <div className="sign-out-btn">
          <Button variation="primary" onClick={signOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
