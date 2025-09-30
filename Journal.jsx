import React, { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, Trash, Edit, Paperclip } from "lucide-react";
import Sidebar from "../UI/Sidebar";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BASE_URL = "http://localhost:5001";

const Journal = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState({
    _id: null,
    title: "",
    description: "",
    status: "Pending",
    file: null,
    filePreview: null,
    dateTime: new Date(),
  });

  const fileInputRef = useRef(null);
  const toggleSidebar = () => setIsOpen(prev => !prev);
  const columns = ["Pending", "In Progress", "Done"];

  // Fetch tasks
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/tasks`)
      .then(res => setTasks(res.data))
      .catch(err => console.error("Error fetching tasks:", err));
  }, []);

  const openModal = task => {
    if (task) {
      setCurrentTask({ ...task, dateTime: task.dateTime ? new Date(task.dateTime) : new Date() });
    } else {
      setCurrentTask({
        _id: null,
        title: "",
        description: "",
        status: "Pending",
        file: null,
        filePreview: null,
        dateTime: new Date(),
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setCurrentTask({ ...currentTask, file, filePreview: previewUrl });
  };

  const saveTask = async () => {
    try {
      const formData = new FormData();
      formData.append("title", currentTask.title);
      formData.append("description", currentTask.description);
      formData.append("status", currentTask.status);
      formData.append("dateTime", currentTask.dateTime.toISOString());
      if (currentTask.file) formData.append("file", currentTask.file);

      let res;
      if (currentTask._id) {
        res = await axios.put(`${BASE_URL}/api/tasks/${currentTask._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setTasks(tasks.map(t => (t._id === res.data._id ? res.data : t)));
      } else {
        res = await axios.post(`${BASE_URL}/api/tasks`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setTasks([...tasks, res.data]);
      }

      closeModal();
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

  const deleteTask = async id => {
    try {
      await axios.delete(`${BASE_URL}/api/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const onDragEnd = async result => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const task = tasks.find(t => String(t._id) === draggableId);
    if (!task || task.status === destination.droppableId) return;

    const updatedTask = { ...task, status: destination.droppableId };
    setTasks(prev => prev.map(t => (t._id === task._id ? updatedTask : t))); // optimistic update

    try {
      await axios.put(`${BASE_URL}/api/tasks/${task._id}`, updatedTask);
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-x-hidden">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        
        {/* Header + Add Task Button */}
        <div className="flex flex-col sm:flex-row sm:mt-3 justify-between items-center mb-4 gap-2">
          <h2 className="text-lg font-semibold">Tasks</h2>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition w-auto"
          >
            <Plus size={16} /> Add
          </button>
        </div>

        {/* Drag and Drop */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex flex-col md:flex-row gap-4 overflow-x-auto">
            {columns.map(col => (
              <Droppable droppableId={col} key={col}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`flex-shrink-0 w-full md:w-80 bg-gray-100 p-2 rounded-md min-h-[300px] ${
                      snapshot.isDraggingOver ? "bg-gray-200" : ""
                    }`}
                  >
                    <h3 className="font-semibold mb-2 text-center">{col}</h3>
                    {tasks
                      .filter(t => t.status === col)
                      .map((task, index) => (
                        <Draggable draggableId={String(task._id)} index={index} key={task._id}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white p-3 rounded-md shadow mb-3 cursor-pointer ${
                                snapshot.isDragging ? "bg-blue-50" : ""
                              }`}
                            >
                              <h4 className="font-semibold">{task.title}</h4>
                              <p className="text-sm text-gray-600 mb-1">{task.description}</p>
                              {task.filePreview && (
                                <div className="mb-1">
                                  {task.filePreview.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                                    <img src={task.filePreview} alt="attachment" className="w-full max-h-40 object-contain rounded" />
                                  ) : task.filePreview.match(/\.(mp4|webm)$/i) ? (
                                    <video src={task.filePreview} controls className="w-full max-h-40 rounded" />
                                  ) : (
                                    <a href={task.filePreview} target="_blank" rel="noreferrer" className="text-blue-600 underline flex items-center gap-1">
                                      <Paperclip size={14} /> Attachment
                                    </a>
                                  )}
                                </div>
                              )}
                              <p className="text-xs text-gray-500">{task.dateTime ? new Date(task.dateTime).toLocaleString() : ""}</p>
                              <div className="flex gap-2 mt-2">
                                <Edit className="cursor-pointer text-blue-600" onClick={() => openModal(task)} />
                                <Trash className="cursor-pointer text-red-600" onClick={() => deleteTask(task._id)} />
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
              <h2 className="text-xl font-semibold mb-4">{currentTask._id ? "Edit Task" : "Add Task"}</h2>
              <input
                type="text"
                placeholder="Title"
                className="w-full border-b-2 mb-2 p-1 focus:outline-none"
                value={currentTask.title}
                onChange={e => setCurrentTask({ ...currentTask, title: e.target.value })}
              />
              <textarea
                placeholder="Description"
                className="w-full border-b-2 mb-2 p-1 focus:outline-none"
                value={currentTask.description}
                onChange={e => setCurrentTask({ ...currentTask, description: e.target.value })}
              />
              <div className="flex flex-col sm:flex-row gap-2 mb-2">
                <select
                  value={currentTask.status}
                  onChange={e => setCurrentTask({ ...currentTask, status: e.target.value })}
                  className="border px-2 py-1 rounded w-full sm:w-auto"
                >
                  {columns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1 w-full sm:w-auto"
                >
                  <Paperclip size={16}/> Attach File
                </button>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                <DatePicker
                  selected={currentTask.dateTime}
                  onChange={date => setCurrentTask({ ...currentTask, dateTime: date })}
                  showTimeSelect
                  dateFormat="Pp"
                  minDate={new Date()}
                  className="border px-2 py-1 rounded w-full sm:w-auto"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4 flex-wrap">
                <button className="px-3 py-1 rounded bg-gray-300" onClick={closeModal}>Cancel</button>
                <button className="px-3 py-1 rounded bg-blue-500 text-white" onClick={saveTask}>Save</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Journal;
