import 'bootstrap/dist/css/bootstrap.css';
import { useState, useEffect } from 'react';

import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';

function App() {

  const [students, setStudents] = useState([]);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalAdd, setModalAdd] = useState(false);
  const [student, setStudent] = useState({
    name: "",
    email: "",
    dob: ""
  })

  const handleInputChange = (event) => {
    setStudent({ ...student, [event.target.name]: event.target.value });
  }

  const setSelectedStudent = (studentItem, action) => {
    if (studentItem === null) {
      studentItem = {
        name: "",
        email: "",
        dob: ""
      };
    }
    setStudent(studentItem);
    if (action === "edit") {
      setModalEdit(true);
    } else if (action === "delete") {
      setModalDelete(true);
    } else if (action === "add") {
      setModalAdd(true);
    }
  };

  const handleEdit = () => {
    fetch(`http://localhost:8080/api/v1/student/${student.id}?name=${student.name}&email=${student.email}`, { method: "PUT" })
      .then(response => {
        if (response.ok) {
          let newData = students;
          newData.map(studentItem => {
            if (studentItem.id === student.id) {
              studentItem.name = student.name;
              studentItem.email = student.email;
            }
          })
          setStudents(newData);
        }
        setModalEdit(false);
      });
  };

  const handleDelete = () => {
    fetch(`http://localhost:8080/api/v1/student/${student.id}`, { method: "DELETE" })
      .then(response => {
        if (response.ok) {
          let newData = students.filter(studentItem => studentItem.id !== student.id);
          setStudents(newData);
        }
        setModalDelete(false);
      });
  };

  const handleAdd = () => {
    fetch("http://localhost:8080/api/v1/student", { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(student) })
      .then(response => {
        if (response.ok) {
          return fetch("http://localhost:8080/api/v1/student");
        } else {
          throw new Error("Failed to add student");
        }
      })
      .then(async response => {
        if (response.ok) {
          setStudents(await response.json())
          setModalAdd(false);
        } else {
          throw new Error("Failed to load students")
        }
      })
      .catch(error => {
        console.log(error);
        setModalAdd(false);
      });
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/student")
      .then(async (response) => {
        if (response.ok) {
          setStudents(await response.json())
        }
      });
  }, []);

  return (
    <div className="container">
      <h1>Students</h1>
      <button className="btn btn-primary" onClick={() => {
        setSelectedStudent(null, "add");
        setModalAdd(true);
      }}>
        Add
      </button>
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => {
            return (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.email}</td>                
                <td>
                  <button onClick={() => setSelectedStudent(student, "edit")} className="btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                    </svg>
                  </button>
                  <button onClick={() => setSelectedStudent(student, "delete")} className="btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                      <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                    </svg>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal Add */}
      <Modal isOpen={modalAdd}>
        <ModalHeader>
          Add Student
        </ModalHeader>
        <ModalBody>
          <form>
            <div className="col-auto">
              <label className="form-label">Name</label>
              <input className="form-control" type="text" name="name" required="true" value={student ? student.name : ''} onChange={handleInputChange} />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input className="form-control" type="email" name="email" required="true" value={student ? student.email : ''} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Date of birth</label>
              <input className="form-control" type="date" name="dob" required="true" value={student ? student.dob : ''} onChange={handleInputChange} />
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <button type="button" className="btn btn-primary" onClick={handleAdd}>Add</button>
          <button type="button" className="btn" onClick={() => setModalAdd(false)}>Cancel</button>
        </ModalFooter>
      </Modal>

      {/* Modal Edit */}
      <Modal isOpen={modalEdit}>
        <ModalHeader>
          Edit Student
        </ModalHeader>
        <ModalBody>
          <form>
            <div className="col-auto">
              <label className="form-label">Name</label>
              <input className="form-control" type="text" name="name" value={student.name} onChange={handleInputChange} />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input className="form-control" type="email" name="email" value={student.email} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Date of birth</label>
              <input className="form-control" type="date" name="dob" value={student.dob} onChange={handleInputChange} />
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <button type="button" className="btn btn-primary" onClick={handleEdit}>Update</button>
          <button type="button" className="btn" onClick={() => setModalEdit(false)}>Cancel</button>
        </ModalFooter>
      </Modal>

      {/* Modal Delete */}
      <Modal isOpen={modalDelete}>
        <ModalHeader>
          Delete Student
        </ModalHeader>
        <ModalBody>
          Are you sure you want to delete the student "{student && student.name}"?
        </ModalBody>
        <ModalFooter>
        <button type="button" className="btn btn-danger" onClick={handleDelete}>Yes</button>
          <button type="button" className="btn" onClick={() => setModalDelete(false)}>No</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
