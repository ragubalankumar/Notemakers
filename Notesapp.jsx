import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { NotebookPen } from "lucide-react";

const Notesapp = () => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex flex-col sm:flex-row min-h-screen overflow-x-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <p className="mt-2 text-gray-600">This is your main content area.</p>

        <div className="mt-10">
          <img
            src="public/notes_comic.png"
            alt="comic_img"
            className="h-40 w-full object-cover rounded-md"
          />
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Note Card */}
            <div className="bg-green-300 py-2 px-2 rounded-md">
              <div className="flex justify-between items-center mb-1.5">
                <h1 className="text-black font-semibold text-md">Notes 1</h1>
                <NotebookPen className="cursor-pointer" />
              </div>
              <hr />
              <ul className="mt-1 list-disc ml-5 text-sm">
                <li>It my first notes</li>
                <li>check the notes</li>
                <li>I am happy to use it</li>
              </ul>
            </div>

            <div className="bg-blue-200 py-2 px-2 rounded-md">
              <div className="flex justify-between items-center mb-1.5">
                <h1 className="text-black font-semibold text-md">Notes 2</h1>
                <NotebookPen className="cursor-pointer" />
              </div>
              <hr />
              <ul className="mt-1 list-disc ml-5 text-sm">
                <li>It my first notes</li>
                <li>check the notes</li>
                <li>I am happy to use it</li>
              </ul>
            </div>

            <div className="bg-amber-200 py-2 px-2 rounded-md">
              <div className="flex justify-between items-center mb-1.5">
                <h1 className="text-black font-semibold text-md">Notes 3</h1>
                <NotebookPen className="cursor-pointer" />
              </div>
              <hr />
              <ul className="mt-1 list-disc ml-5 text-sm">
                <li>It my first notes</li>
                <li>check the notes</li>
                <li>I am happy to use it</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notesapp;
