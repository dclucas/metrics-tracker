import React from 'react'
import UserDetails from '../components/UserDetails'

const User = ({ match: { params: { username } } }) => {
    console.log('User render', username);
    return (
    <div>
        <UserDetails username={username}/>
    </div>);
}

export default User