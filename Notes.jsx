import React, { useState, useRef, useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { Calendar, Paperclip, Plus, Trash, Edit, VideoIcon, AudioLinesIcon } from "lucide-react";
import Sidebar from "../UI/Sidebar";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import VideoCapture from "./VideoCapture.jsx";



const BASE_URL = "http://localhost:5001";

const Notes = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [showVideoCapture, setShowVideoCapture] = useState(false);
  const [currentNote, setCurrentNote] = useState({ _id: null, title: "", file: null, filePreview: null });
  const [editorContent, setEditorContent] = useState("");
  const [noteDateTime, setNoteDateTime] = useState(new Date());
  const [editMode, setEditMode] = useState(false);

  const fileInputRef = useRef(null);
  const datePickerRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: { style: "max-width:300px; max-height:200px; object-fit:contain; margin-left:10px; border-radius:8px;" },
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => setEditorContent(editor.getHTML()),
  });

  useEffect(() => {
    axios.get(`${BASE_URL}/api/notes`)
      .then(res => setNotes(res.data))
      .catch(err => console.error("Error fetching notes:", err));
  }, []);

  const openModal = (note = null) => {
    setModalOpen(true);
    if (note) {
      setEditMode(true);
      setCurrentNote({ _id: note._id, title: note.title, file: note.file, filePreview: note.filePreview || note.file });
      setEditorContent(note.body);
      setNoteDateTime(note.dateTime ? new Date(note.dateTime) : new Date());
      editor?.commands.setContent(note.body);
    } else {
      setEditMode(false);
      setCurrentNote({ _id: null, title: "", file: null, filePreview: null });
      setEditorContent("");
      setNoteDateTime(new Date());
      editor?.commands.clearContent();
    }
  };

  const closeModal = () => setModalOpen(false);
  const openSaveModal = () => setSaveModalOpen(true);
  const cancelSave = () => { setSaveModalOpen(false); closeModal(); };

  const confirmSave = async () => {
    try {
      const noteData = { title: currentNote.title || "Untitled", body: editorContent, file: currentNote.filePreview, dateTime: noteDateTime };
      if (editMode && currentNote._id) {
        const res = await axios.put(`${BASE_URL}/api/notes/${currentNote._id}`, noteData);
        setNotes(notes.map(n => (n._id === res.data._id ? res.data : n)));
      } else {
        const res = await axios.post(`${BASE_URL}/api/notes`, noteData);
        setNotes([...notes, res.data]);
      }
      setCurrentNote({ _id: null, title: "", file: null, filePreview: null });
      setEditorContent("");
      setNoteDateTime(new Date());
      editor?.commands.clearContent();
      setSaveModalOpen(false);
      setModalOpen(false);
      setEditMode(false);
    } catch (err) {
      console.error("Error saving note:", err);
    }
  };

  const handleAttachClick = () => fileInputRef.current.click();

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        editor?.chain().focus().setImage({ src: reader.result }).run();
        setCurrentNote({ ...currentNote, file, filePreview: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      setCurrentNote({ ...currentNote, file, filePreview: null });
    }
  };

  const deleteNote = async id => {
    try {
      await axios.delete(`${BASE_URL}/api/notes/${id}`);
      setNotes(notes.filter(n => n._id !== id));
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  const toggleSidebar = () => setIsOpen(prev => !prev);

  return (
    <div className="flex flex-col sm:flex-row h-screen overflow-hidden">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <button
          className="flex items-center gap-2 bg-slate-200 p-2 rounded-md mb-4 w-full sm:w-auto"
          onClick={() => openModal()}
        >
          <Plus size={18} /> Add new note
        </button>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 flex items-start sm:items-center justify-center z-50 overflow-y-auto p-4">
            <div className="bg-gray-100 px-4 py-6 sm:px-6 sm:py-8 rounded-lg shadow-md w-full sm:w-3/4 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                <ul><li className="bg-slate-200 p-2 rounded-md">Notes</li></ul>
                <button className="bg-green-700 py-2 px-4 rounded-md text-white" onClick={openSaveModal}>Save</button>
              </div>

              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Enter title"
                  className="w-full border-b-2 focus:outline-none mt-1"
                  value={currentNote.title}
                  onChange={e => setCurrentNote({ ...currentNote, title: e.target.value || "Untitled" })}
                />
                <div className="border-2 rounded-md p-3 sm:p-5 h-60 overflow-y-auto mb-2">
                  <EditorContent editor={editor} />
                </div>

                <div className="flex gap-3 flex-wrap">
                  <Paperclip onClick={handleAttachClick} className="cursor-pointer" />
                  <Calendar onClick={() => datePickerRef.current.setOpen(true)} className="cursor-pointer" />
                  <VideoIcon onClick={() => setShowVideoCapture(true)} className="cursor-pointer" />
                  <AudioLinesIcon />
                </div>

                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*,audio/*,video/*" />
                <DatePicker ref={datePickerRef} selected={noteDateTime} onChange={setNoteDateTime} showTimeSelect dateFormat="Pp" className="hidden" />

                {showVideoCapture && (
                  <VideoCapture
                    onSave={videoBlob => {
                      const videoUrl = URL.createObjectURL(videoBlob);
                      setCurrentNote({ ...currentNote, file: videoBlob, filePreview: videoUrl });
                      editor?.chain().focus().insertContent(
                        `<video controls src="${videoUrl}" style="max-width:100%; border-radius:8px;"></video>`
                      ).run();
                    }}
                    onClose={() => setShowVideoCapture(false)}
                  />
                )}

                <div
                  className="mt-4"
                  dangerouslySetInnerHTML={{
                    __html: editorContent.replace(
                      /<video[^>]*src="([^"]+)"[^>]*>.*?<\/video>/g,
                      `<a href="$1" target="_blank" class="text-blue-600 underline flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-6.586-3.792A1 1 0 007 8.17v7.66a1 1 0 001.166.986l6.586-1.75a1 1 0 00.584-.99V12.16a1 1 0 00-.584-.992z" />
                        </svg>
                        Play Video
                      </a>`
                    )
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Save modal */}
        {saveModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-md shadow-lg w-11/12 sm:w-96 text-center">
              <p className="text-lg font-semibold mb-4">Do you want to save this note?</p>
              <div className="flex justify-center gap-6 flex-wrap">
                <button className="bg-green-700 py-2 px-4 rounded-md text-white" onClick={confirmSave}>Save</button>
                <button className="bg-red-600 py-2 px-4 rounded-md text-white" onClick={cancelSave}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Notes list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map(note => (
            <div
              key={note._id}
              className="bg-white p-3 rounded-md shadow cursor-pointer hover:bg-gray-50 flex flex-col"
              onClick={() => openModal(note)}
            >
              <h3 className="font-semibold">{note.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{note.dateTime ? new Date(note.dateTime).toLocaleString() : ""}</p>
              <div
                dangerouslySetInnerHTML={{
                  __html: note.body.replace(
                    /<video[^>]*src="([^"]+)"[^>]*>.*?<\/video>/g,
                    `<a href="$1" target="_blank" class="text-blue-600 underline flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-6.586-3.792A1 1 0 007 8.17v7.66a1 1 0 001.166.986l6.586-1.75a1 1 0 00.584-.99V12.16a1 1 0 00-.584-.992z" />
                      </svg>
                      Play Video
                    </a>`
                  )
                }}
              />
              <div className="mt-2 flex gap-2 ml-auto" onClick={e => e.stopPropagation()}>
                <Edit className="cursor-pointer hover:text-blue-600" onClick={() => openModal(note)} />
                <Trash className="cursor-pointer hover:text-red-600" onClick={() => deleteNote(note._id)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notes;
