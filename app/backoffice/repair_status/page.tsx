'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import config from "@/app/config";
import Modal from "@/app/components/modal";
import dayjs from "dayjs";

export default function Page() {
    const [repairRecoards, setRepairRecoards] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [id, setId] = useState(0);

    useEffect(() => {
        fetchRepairRecoard();
    }, []);

    const fetchRepairRecoard= async () => {
        try {
            const response = await axios.get(`${config.apiUrl}/api/repair_record/list`);
            setRepairRecoards(response.data);
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'error',
                text: error.message
            });
        }
    }

    const getStatusName =(status: string) => {
        switch (status) {
            case 'active':
                return 'Waiting for repair';
            case 'pending':
                return 'Waiting for customers';    
            case 'repairing':
                return 'Repairing';
            case 'done':
                return 'Done';
            case 'cancel':
                return 'Cancel';
            default:
                return 'Waiting for repair'
        }
    }

    const handleEdit = (id: number) => {
        setId(id);
        setShowModal(true);
    }

    return (
        <>
            <div className="card">
                <h1>Repair Status</h1>
                <div className="card-body">
                    <table className="table mt-3">
                        <thead>
                            <tr>
                                <th>EN.</th>
                                <th>Device Name</th>
                                <th>Problem</th>
                                <th>Start JobDate</th>
                                <th>End JobDate</th>
                                <th>Status</th>
                                <th style={{ width: '170px' }} className="text-center">Manage Status</th>
                            </tr>                          
                        </thead>
                        <tbody>
                            {repairRecoards.map((repairRecord: any) => 
                                <tr key={repairRecord.id}>
                                    <td>{repairRecord.customerName}</td>
                                    <td>{repairRecord.deviceName}</td>
                                    <td>{repairRecord.problem}</td>
                                    <td>{dayjs(repairRecord.createdAt).format('DD/MM/YYYY HH:mm')}</td>
                                    <td>{repairRecord.endJobDate ? dayjs(repairRecord.endJobDate).format('DD/MM/YYYY HH:mm') : '-'}</td>
                                    <td>{getStatusName(repairRecord.status)}</td>
                                    <td className="text-center">
                                        <button className="btn-edit"onClick={() => handleEdit(repairRecoards.id)}>
                                            <i className="fa-solid fa-edit mr-3"></i>
                                            EditStatus
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal title="Edit Status" isOpen={showModal} onClose={() => setShowModal(false)}>
                <div>
                    <div>Select Status</div>
                    <div>
                        <select className="form-control w-full">
                            <option value="active">Waiting for repair</option>
                            <option value="active">Waiting for customers</option>
                            <option value="active">Repairing</option>
                            <option value="active">Success</option>
                            <option value="active">Cancle</option>
                        </select>
                    </div>
                    <div className="mt-3">
                        <div>Solve the problem</div>
                        <textarea className="form-control w-full" rows={5}></textarea> 
                    </div>
                    <button className="btn-primary mt-3">
                        <i className="fa-solid fa-save mr-3"></i>
                        Save
                    </button>
                </div>
            </Modal>
        </>
       
    )
}