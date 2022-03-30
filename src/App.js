import React, { useState, useEffect } from 'react';
import './App.css';
import { API, Storage } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listComments } from './graphql/queries';
import { createComment as createCommentMutation, deleteComment as deleteCommentMutation } from './graphql/mutations';

const initialFormState = { name: '', description: '' }

function App() {
  const [comments, setComments] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchComments();
  }, []);

  async function fetchComments() {
    const apiData = await API.graphql({ query: listComments });
    const commentsFromAPI = apiData.data.listComments.items;
    await Promise.all(commentsFromAPI.map(async comment => {
      if (comment.image) {
        const image = await Storage.get(comment.image);
        comment.image = image;
      }
      return comment;
    }))
    setComments(apiData.data.listComments.items);
  }

  async function createComment() {
    if (!formData.name || !formData.description) return;
    await API.graphql({ query: createCommentMutation, variables: { input: formData } });
    if (formData.image) {
      const image = await Storage.get(formData.image);
      formData.image = image;
    }
    setComments([ ...comments, formData ]);
    setFormData(initialFormState);
  }

  async function deleteComment({ id }) {
    const newCommentsArray = comments.filter(comment => comment.id !== id);
    setComments(newCommentsArray);
    await API.graphql({ query: deleteCommentMutation, variables: { input: { id } }});
  }

  async function onChange(e) {
    if (!e.target.files[0]) return
    const file = e.target.files[0];
    setFormData({ ...formData, image: file.name });
    await Storage.put(file.name, file);
    fetchComments();
  }

  return (
    <div style={styles.container} className="App">
      <h1>My Comments App</h1>
      <input
        onChange={e => setFormData({ ...formData, 'name': e.target.value})}
        style={styles.input}
        placeholder="Comment name"
        value={formData.name}
      />
      <input
        onChange={e => setFormData({ ...formData, 'description': e.target.value})}
        style={styles.input}
        placeholder="Comment description"
        value={formData.description}
      />
      <input
        type="file"
        onChange={onChange}
      />
      <button style={styles.button} onClick={createComment}>Create Comment</button>
      <div style={{marginBottom: 30}}>
        {
            comments.map(comment => (
              <div key={comment.id || comment.name} style={styles.comment}>
                <h2 style={styles.commentName}>{comment.name}</h2>
                <p style={styles.commentDescription}>{comment.description}</p>
                <button style={styles.button} onClick={() => deleteComment(comment)}>Delete comment</button>
                {
                  comment.image && <img src={comment.image} style={{width: 400}} />
                }
              </div>
            ))
        }
      </div>
      <AmplifySignOut />
    </div>
  );
}

const styles = {
  container: { width: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 20 },
  comment: {  marginBottom: 15 },
  input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
  commentName: { fontSize: 20, fontWeight: 'bold' },
  commentDescription: { marginBottom: 0 },
  button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px' }
}

export default withAuthenticator(App);
