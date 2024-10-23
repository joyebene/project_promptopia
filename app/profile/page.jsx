"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import Profile from '@components/Profile';

import React from 'react'

const MyProfile = () => {
  const router = useRouter;
    const {data: session} = useSession();

    const [posts, setPosts] = useState([]);


    useEffect(() => {
        const fetchPosts = async () => {
          const response = await fetch(`api/prompt/${session?.user.id}/posts`);
          const data = await response.json();
    
          setPosts(data);
        };
    
       if(session?.user.id) fetchPosts();
      }, []);



    const handleEdit = (post) => {
      router.push(`/update-prompt?id=${post._id}`)
    }

    const handleDelete = async (post) => {
        const hasComfirmed = confirm("Are you sure want to delete this prompt?");

        if(hasComfirmed) {
          try {
            await fetch(`/api/prompt/${post._id.toString()}`, {
              method: 'DELETE'
            })
            
            const filteredPosts = posts.filter((p) => p._id !== post._id);

            setPosts(filteredPosts);
          } catch (error) {
            console.log(error);
            
          }
        }
    }

  return (
    <div>
        <Profile 
        name="My"
        desc="Welcome to your personalized profile page"
        data={posts}
        handleEdit={handleEdit}
        handleDelete={handleDelete} />
    </div>
  )
}

export default MyProfile;