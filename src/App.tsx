import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Modal, Button } from 'react-bootstrap';
import {
  FaPlus, FaEdit, FaTrash, FaUserCircle, FaUser, FaPhone, FaCity, FaGlobe,
  FaMapMarkedAlt, FaMapMarker, FaCommentDots, FaStoreAlt, FaSun, FaSynagogue, FaUsers, FaHeading
} from "react-icons/fa";
import { MdEmail, MdFolderZip, MdDescription } from "react-icons/md";
import { FaSignsPost, FaUsersRectangle } from "react-icons/fa6";
import type { User,Post,Comments } from './type';
import {
  getAllUsers,
  getPostsByUser,
  getAllPosts,
  getCommentsByPost,
  createPost,
  updatePost,
  deletePost,
} from "./api/apiService";

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comments[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>("User Post");
  const [showModalUpdate, setShowModalUpdate] = useState<boolean>(false);
  const [showModalNewPost, setShowModalNewPost] = useState<boolean>(false);
  const [showModalComment, setShowModalComment] = useState<boolean>(false);
  const [updatePostData, setUpdatePostData] = useState<Post>();
  const [newPost, setNewPost] = useState<{ title: string; body: string }>({ title: "", body: "" });

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
      setSelectedUser(data[0] || null);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPosts = async (userId: number) => {
    try {
      const data = await getPostsByUser(userId);
      setPosts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllPosts = async () => {
    try {
      const data = await getAllPosts();
      setAllPosts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchComments = async (postId: number) => {
    try {
      const data = await getCommentsByPost(postId);
      setComments(data);
    } catch (error) {
      console.error(error);
    }
  };

  const savePostChanges = async () => {
    if (!updatePostData) return;
    try {
      const updated = await updatePost(updatePostData);
      setPosts(posts.map(p => p.id === updated.id ? updated : p));
      setShowModalUpdate(false);
    } catch (error) {
      console.error(error);
      alert("Post güncellenirken hata oluştu");
    }
  };

  const saveNewPost = async () => {
    if (!selectedUser) return;
    try {
      const created = await createPost({ ...newPost, userId: selectedUser.id });
      setPosts(prev => [created, ...prev]);
      setShowModalNewPost(false);
      setNewPost({ title: "", body: "" });
    } catch (error) {
      console.error(error);
      alert("Post eklenirken hata oluştu");
    }
  };

  const handleDeletePostClick = async (id: number) => {
    if (!window.confirm("Silmek istediğinize emin misiniz?")) return;
    try {
      await deletePost(id);
      setPosts(posts.filter(p => p.id !== id));
    } catch (error) {
      console.error(error);
      alert("Post silinirken hata oluştu");
    }
  };

  const handleUpdatePostChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!updatePostData) return;
    const { id, value } = e.target;
    setUpdatePostData({ ...updatePostData, [id === "titlePost" ? "title" : "body"]: value });
  };

  const handleNewPostChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setNewPost(prev => ({ ...prev, [id === "titlePost" ? "title" : "body"]: value }));
  };

  useEffect(() => {
    fetchUsers();
    fetchAllPosts();
  }, []);

  useEffect(() => {
    if (selectedUser) fetchPosts(selectedUser.id);
    else setPosts([]);
  }, [selectedUser]);

  return (
    <>
      {/* Topbar */}
      <nav className="navbar navbar-dark bg-dark mb-4 p-2">

        <div className="container-fluid">
          <span className='navbar-brand'>Ege Cengiz Ortakcı</span>
          <div className="d-flex">
            <div className="dropdown navbar-brand ">
              <button
                className="btn btn-primary dropdown-toggle"
                type="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {selectedItem} {/* seçili olan yazıyor */}
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="userDropdown"
              >
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => setSelectedItem("User Post")}
                  >
                    <FaUsersRectangle className="me-1" />
                    User Post
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => setSelectedItem("All Users")}
                  >
                    <FaUsers className="mb-1 me-1" />
                    All Users
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => setSelectedItem("All Posts")}
                  >
                    <FaSignsPost className="mb-1 me-1" />
                    All Posts
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <div className="container">

        {selectedItem == "User Post" ?
          <div className="row">

            <div className="col-md-3 mb-4">
              <div className='d-flex justify-content-between'>
                <h5><FaUserCircle className='mb-1' /> Users</h5>
              </div>
              <hr />
              <div className="list-group">
                {users.map(user => (
                  <div key={user.id} className='d-flex'>
                    <button

                      className={`list-group-item list-group-item-action ${selectedUser?.id === user.id ? 'active' : ''}`}
                      onClick={() => setSelectedUser(user)}
                    >
                      {user.name}
                    </button>

                  </div>
                ))}
              </div>
            </div>
            <div className="col-md-9">
              {selectedUser ? (
                <>
                  <div className='card-title  d-flex justify-content-between'>
                    <h5><FaUser className='mb-1 me-2' />{selectedUser.name}</h5>
                    <div className='ms-2 d-flex mt-1 '>
                    </div>
                  </div>
                  <hr></hr>
                  <div className="card mb-4 shadow-sm">
                    <div className="card-body">

                      <div className="row">
                        <div className="col-md-6 mb-2"><strong><FaUser className='mb-1 me-1' />Username:</strong> {selectedUser.username}</div>
                        <div className="col-md-6 mb-2"><strong><MdEmail className='mb-1 me-1' />Email:</strong> {selectedUser.email}</div>
                        <div className="col-md-6 mb-2"><strong><FaPhone className='mb-1 ' /> Phone:</strong> {selectedUser.phone}</div>
                        <div className="col-md-6 mb-2"><strong><FaGlobe className='mb-1 ' />  Website:</strong> {selectedUser.website}</div>
                        <div className="col-md-6 mb-2"><strong><FaCity className='mb-1 ' /> City:</strong> {selectedUser.address.city}</div>
                        <div className="col-md-6 mb-2"><strong><FaMapMarker className='mb-1 ' />  Street / Suite:</strong> {selectedUser.address.street} / {selectedUser.address.suite}</div>
                        <div className="col-md-6 mb-2"><strong><MdFolderZip className='mb-1 ' />  Zipcode:</strong> {selectedUser.address.zipcode}</div>
                        <div className="col-md-6 mb-2"><strong><FaMapMarkedAlt className='mb-1 ' />  Geo:</strong> Lat {selectedUser.address.geo.lat}, Lng {selectedUser.address.geo.lng}</div>
                        <div className="col-md-6 mb-2"><strong><FaStoreAlt className='mb-1 ' /> Company:</strong> {selectedUser.company.name}</div>
                        <div className="col-md-6 mb-2"><strong><FaSun className='mb-1 ' />  Company CatchPhrase:</strong> {selectedUser.company.catchPhrase}</div>
                        <div className="col-md-12 mb-2"><strong><FaSynagogue className='mb-1 ' />  Company BS:</strong> {selectedUser.company.bs}</div>
                      </div>

                    </div>
                  </div>

                  {/* Postlar */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5><FaSignsPost className='mb-1' /> Posts</h5>
                    <button onClick={() => {
                      setShowModalNewPost(true);

                    }} className="btn btn-success btn-sm d-flex align-items-center justify-content-center">
                      <FaPlus size={12} className="me-1" />
                      New Post
                    </button>
                  </div>

                  <hr />
                  <div className="row">
                    {posts.length === 0 && <p>Post none.</p>}
                    {posts.map(post => (
                      <div key={post.id} className="col-md-6 mb-3">
                        <div className="card h-100">
                          <div className="card-body d-flex flex-column">
                            <h5 className="card-title text-center mb-2">{post.title}</h5>
                            <p className="card-text flex-grow-1">{post.body}</p>
                            <div className="mt-2 d-flex justify-content-end">
                              <FaCommentDots className='mb-1 me-3'   style={{ cursor: "pointer" }} color='rgba(0, 119, 255, 1)'
                                onClick={() => {
                                  fetchComments(post.id);
                            
                                  setShowModalComment(true);
                                }}
                              />

                              <FaEdit className='mb-1 me-3' color='#bda84aff'
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  setShowModalUpdate(true);
                                  setUpdatePostData(post);
                                }} />
                              <FaTrash className='mb-1 ' color='rgba(255, 0, 0, 1)'   style={{ cursor: "pointer" }} 
                         
                               onClick={() => {
                                if (window.confirm("Silmek istediğinize emin misiniz?")) {
                                  handleDeletePostClick(post.id);
                                }

                              }} />

                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p>Kullanıcı seçilmedi.</p>
              )}
            </div>
          </div>
          : null}
        {selectedItem === "All Users" ? (
          <div className="card mt-3 shadow-sm">
            <div className="card-body">
              <h5 className="card-title"> <FaUsers className="mb-1 me-1" /> All Users</h5>
              <hr />
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Website</th>
                      <th>Company</th>
                      <th>City</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>{user.website}</td>
                        <td>{user.company.name}</td>
                        <td>{user.address.city}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null}


        {selectedItem == "All Posts" ?
          <>

            {/* Postlar */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5><FaSignsPost className='mb-1' />All Posts</h5>

            </div>

            <hr />
            <div className="row">
              {allPosts.length === 0 && <p>Post none.</p>}
              {allPosts.map(post => (
                <div key={post.id} className="col-md-4 mb-3">
                  <div className="card h-100">
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title text-center mb-2">{post.title}</h5>
                      <p className="card-text flex-grow-1">{post.body}</p>
                      <div className="mt-2 d-flex justify-content-end">

                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </> : null}


          {/* Modals */}
        <Modal show={showModalUpdate} onHide={() => setShowModalUpdate(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title><FaSignsPost /> Update Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="form-group">
                <label><FaHeading className='mb-1'/> Title</label>
                <input type="text" className="form-control" id="titlePost"
                  value={updatePostData?.title || ""} onChange={handleUpdatePostChange} />
              </div>
              <div className="form-group mt-3">
                <label><MdDescription className='mb-1'/> Description</label>
                <textarea className="form-control" rows={5}
                  value={updatePostData?.body || ""} onChange={handleUpdatePostChange} />
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={savePostChanges}>Save Changes</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showModalNewPost} onHide={() => setShowModalNewPost(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>New Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <input type="text" className="form-control mb-2" id="titlePost" placeholder="Title"
                value={newPost.title} onChange={handleNewPostChange} />
              <textarea className="form-control" id="bodyPost" placeholder="Description" rows={5}
                value={newPost.body} onChange={handleNewPostChange} />
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={saveNewPost}>Save</Button>
          </Modal.Footer>
        </Modal>

        <Modal size='lg' show={showModalComment} onHide={() => setShowModalComment(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Comments</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {comments.length > 0 ? comments.map(c => (
              <div key={c.id} className="card mb-3 shadow-sm">
                <div className="card-body">
                  <p className="text-muted mb-2">{c.email}</p>
                  <h6 className="card-title">{c.name}</h6>
                  <p className="card-text">{c.body}</p>
                </div>
              </div>
            )) : <p className="text-muted">No comments.</p>}
          </Modal.Body>
        </Modal>

      </div>





    </>
  );
}

export default App;
