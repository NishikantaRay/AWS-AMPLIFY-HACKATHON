import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import "@aws-amplify/ui-react/styles.css";
import AllNotes from "./components/AllNotes";
import "./App.css";
import {
  withAuthenticator,
} from "@aws-amplify/ui-react";
import { listNotes } from "./graphql/queries";
import { createNote as createNoteMutation } from "./graphql/mutations";
import { API, Storage } from "aws-amplify";
import SideBar from "./components/SideBar";

const App = ({ signOut }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const apiData = await API.graphql({ query: listNotes });
    const notesFromAPI = apiData.data.listNotes.items;
    await Promise.all(
      notesFromAPI.map(async (note) => {
        if (note.image) {
          const url = await Storage.get(note.name);
          note.image = url;
        }
        return note;
      })
    );
    setNotes(notesFromAPI);
  }

  async function createNote(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const image = form.get("image");
    const data = {
      name: form.get("name"),
      description: form.get("description"),
      image: image.name,
    };
    if (!!data.image) await Storage.put(data.name, image);
    await API.graphql({
      query: createNoteMutation,
      variables: { input: data },
    });
    fetchNotes();
    event.target.reset();
  }
  const [currentView, setCurrentView] = useState("allNotes");
  const handleShowAllNotes = () => {
    setCurrentView("allNotes");
  };

  const handleAddNote = () => {
    setCurrentView("addNote");
  };

  return (
    <>
      <SideBar
        handleShowAllNotes={handleShowAllNotes}
        handleAddNote={handleAddNote}
        signOut={signOut}
      />

      <div className="container py-4">
        {currentView === "allNotes" && (
          <div>
            <AllNotes notes={notes} />
          </div>
        )}

        {currentView === "addNote" && (
          <div>
            <div className="container">
              <div className="row">
                <div className="col-md-5"></div>
                <div className="col-md-7">
                  <div className="notes-heading">
                    <h1
                      className="notes-heading__title"
                      style={{ marginLeft: "-180px" }}
                    >
                      Add your Notes
                    </h1>
                  </div>
                  <div className="card c-card">
                    <div className="card-body">
                      <h5 className="card-title">Create New Note</h5>
                      <form onSubmit={createNote}>
                        <div className="form-group">
                          <label htmlFor="noteName">Note Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="noteName"
                            name="name"
                            placeholder="Note Name"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="noteDescription">
                            Note Description
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="noteDescription"
                            name="description"
                            placeholder="Note Description"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="noteImage">Image</label>
                          <input
                            type="file"
                            className="form-control-file"
                            id="noteImage"
                            name="image"
                          />
                        </div>
                        <div className="text-center">
                          <button type="submit" className="btn btn-primary">
                            Create Note
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default withAuthenticator(App);
