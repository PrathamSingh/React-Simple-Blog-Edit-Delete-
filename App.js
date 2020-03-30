import React from 'react';
import './App.css';
import axios from 'axios';

class App extends React.Component {
  state = {
    id: '',
    title: '',
    body: '',
    data: []
  };

  changeId = e => {
    let id = e.target.value;
    this.setState({
      id: id
    });
  };

  changeTitle = e => {
    let title = e.target.value;
    this.setState({
      title: title
    });
  };

  changeBody = e => {
    let body = e.target.value;
    this.setState({
      body: body
    });
  };

  editPost = (postIndex, title, body) => {
    this.setState({
      id: postIndex + 1,
      title: title,
      body: body
    });
  };

  addOrUpdatePost = e => {
    e.preventDefault();
    if (
      this.state.title === '' ||
      this.state.body === '' ||
      this.state.id === ''
    ) {
      alert('No field should be empty');
      return;
    } else if (this.state.id > this.state.data.length + 1) {
      alert('Please use the next id');
    } else {
      if (this.state.data[this.state.id - 1] !== undefined) {
        axios
          .put(`https://jsonplaceholder.typicode.com/posts/${this.state.id}`, {
            id: this.state.id,
            title: this.state.title,
            body: this.state.body
          })
          .then(res => {
            let updatedData = [...this.state.data];
            updatedData[this.state.id - 1] = res.data;
            this.setState({
              id: updatedData.length + 1,
              title: '',
              body: '',
              data: updatedData
            });
            console.log(res);
          })
          .catch(err => console.log(err));
      } else {
        axios
          .post('https://jsonplaceholder.typicode.com/posts', {
            id: this.state.id + 1,
            title: this.state.title,
            body: this.state.body
          })
          .then(res => {
            console.log(res);
            let newPost = res.data;
            let newData = [...this.state.data, newPost];
            this.setState({
              id: this.state.id + 1,
              title: '',
              body: '',
              data: newData
            });
          })
          .catch(err => console.log(err));
      }
    }
  };

  deletePost = postIndex => {
    axios
      .delete(`https://jsonplaceholder.typicode.com/posts/${postIndex}`)
      .then(res => {
        let newData = [...this.state.data];
        newData.splice(postIndex, 1);
        this.setState({
          id: newData.length + 1,
          title: '',
          body: '',
          data: newData
        });
        console.log(res);
      })
      .catch(err => console.log(err));
  };

  componentDidMount() {
    axios
      .get('https://jsonplaceholder.typicode.com/posts')
      .then(res => {
        let newData = res.data.slice(0, 10);
        this.setState(
          {
            id: newData[newData.length - 1].id + 1,
            data: newData
          },
          () => console.log(this.state.id)
        );
        console.log(newData);
      })
      .catch(err => console.log("Couldn't fetch data. Error: " + err));
  }

  render() {
    return (
      <div className='ArticleContainer'>
        <h1>Simple Blog</h1>
        <div className='AddArticle'>
          <b>id of article: </b>
          <input type='number' onChange={this.changeId} value={this.state.id} />
          <form>
            <input
              onChange={this.changeTitle}
              type='text'
              placeholder='Title'
              value={this.state.title}
            />
            <textarea
              onChange={this.changeBody}
              placeholder='Enter Body'
              value={this.state.body}
            ></textarea>
            <input
              onClick={this.addOrUpdatePost}
              type='submit'
              value='Add/Update Post'
            />
          </form>
        </div>
        {this.state.data.length === 0 ? (
          <p>Loading Posts...</p>
        ) : (
          this.state.data.map((post, index) => (
            <article key={index}>
              <h2>
                {index + 1}. {post.title}
              </h2>
              <p>{post.body.substr(0, 100)}...</p>
              <button onClick={() => this.deletePost(index)} className='delete'>
                Delete
              </button>
              <button
                onClick={() => this.editPost(index, post.title, post.body)}
                className='edit'
              >
                Edit
              </button>
            </article>
          ))
        )}
      </div>
    );
  }
}

export default App;
