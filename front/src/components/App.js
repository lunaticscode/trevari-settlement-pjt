import React from 'react';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            postData : [],
        }
    }
    async componentDidMount() {
        try {
            const res = await fetch('http://localhost:9501/api/posts/');
            const posts = await res.json();
            this.setState({postData:posts});
            console.log(posts);
        } catch (e) {
            console.log(e);
        }
    }

    deletePost() {
        fetch('http://localhost:9501/api/posts/'+11+'/', {
            method:"DELETE",
            headers: {
                'content-type' : 'application/json'
            },
        })
            .then( res => res.json())
            .then( data => console.log(data));

    }
    addPost() {
        let post_info = {
            title:'assasddasd',
            content:'tweleveasd',
        };
        fetch('http://localhost:9501/api/posts/', {
            method: "POST",
            headers:{
                'content-type':'application/json'
            },
            body:JSON.stringify(post_info)
        })
            .then( res => res.json())
            .then( data => console.log(data));
    }

    render() {


        return (

            <div>
                <button onClick={this.addPost}>Add</button>
                <button onClick={this.deletePost}>Delete</button>

                {this.state.postData.map(item => (
                        <div>
                            <div key={item.id}>
                                <h1>{item.title}</h1>
                                <span>{item.content}</span>
                            </div>
                        </div>
                    ))}
            </div>
    )
        ;
    }
}

export default App;
