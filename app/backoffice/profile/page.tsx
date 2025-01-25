'use client';

import { useState } from "react";
import { config } from "../../config";
import Swal from "sweetalert2";
import axios from "axios";

export default function Page() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSave = async () => {
        if (username == '') {
            Swal.fire({
                icon: 'error',
                title: 'error',
                text: 'Username is required'
            });
            return;
        }

        if (password !== '' && confirmPassword == '') {
            if (password !== confirmPassword) {
                Swal.fire({
                    icon: 'error',
                    title: 'error',
                    text: 'Password and Confirm Password must be the same'
                });
                return;
            }
        }

        try {
            const payload = {
                username: username,
                password: password
            }

            const headers = {'Authorization': `Bearer ${localStorage.getItem(config.tokenKey)}`};

            const response = await axios.put(`${config.apiUrl}/api/user/update`, payload, {headers: headers}); 
            
            if (response.data.staus == 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'save success',
                    text: 'Profile updated'
                });
            }

        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'error',
                text: error.message
            });
        }
    }

    return (
        <div className="card">
            <h1>Profile</h1>
            <div className="card-body">
                <div>Username</div>
                <input type="text" className="form-control" placeholder="Username" onChange={(e) => setUsername(e.target.value)}/>

                <div className="mt-5">Password (หากไม่ต้องการเปลี่ยนให้ปล่อยว่าง)</div>
                <input type="password" className="form-control" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

                <div className="mt-5">Confirm Password (หากไม่ต้องการเปลี่ยนให้ปล่อยว่าง)</div>
                <input type="password" className="form-control" placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} />

                <button onClick={handleSave} className="btn-primary">
                    <i className="fa-solid fa-check mr-3"></i>
                    Save
                </button>
                
            </div>
        </div>
    )
}