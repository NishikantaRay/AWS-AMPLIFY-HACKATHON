import React from "react";
import { useState, useEffect } from "react";

import { Button, Image } from "@aws-amplify/ui-react";
import { deleteNote as deleteNoteMutation } from "../graphql/mutations";
import { API, Storage } from "aws-amplify";

export default function AllNotes({ notes }) {
  const [notesc, setCNotes] = useState([]);
  useEffect(() => {
    setCNotes(notes);
  }, [notes]);
  async function deleteNote({ id, name }) {
    const newNotes = notes.filter((note) => note.id !== id);
    setCNotes(newNotes);
    await Storage.remove(name);
    await API.graphql({
      query: deleteNoteMutation,
      variables: { input: { id } },
    });
  }
  return (
    <div>
      <div className="row">
        <div className="col-md-3"></div>
        <div className="col-md-9">
          <div className="notes-heading">
            <h1 className="notes-heading__title">All Notes</h1>
          </div>
          <div className="row justify-content-center">
            {notesc.map((note) => (
              <>
                <div
                  key={note.id || note.name}
                  className="col-md-4 col-10 ml-2 mb-3"
                >
                  <a href={note.description} target="_blank">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">{note.name}</h5>

                        {note.image && (
                          <Image
                            src={note.image}
                            alt={`visual aid for ${note.name}`}
                            style={{ width: "100%" }}
                          />
                        )}
                        <Button
                          variation="link"
                          onClick={() => deleteNote(note)}
                          className="mt-2"
                        >
                          Delete note
                        </Button>
                      </div>
                    </div>
                  </a>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
