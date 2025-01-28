'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import config from "@/app/config";
import Modal from "@/app/components/modal";
import dayjs from "dayjs";

export default function Page() {
    const [repairRecords, setRepairRecords] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [id, setId] = useState(0);
    const [status, setStatus] = useState('');
    const [solving, setSolving] = useState('');
    const [statusList, setStatusList] = useState([
        // { value: 'active', label: 'Waiting for repair' },
        { value: 'pending', label: 'Waiting for customers' },
        { value: 'repairing', label: 'Repairing' },
        { value: 'success', label: 'Success' },
        { value: 'cancel', label: 'Cancel' }
    ])
    const [statusForFilter, setStatusForFilter] = useState('');
    const [tempRepairRecords, setTempRepairRecords] = useState([]);
    const [engineers, setEngineers] = useState([]);
    const [engineerId, setEngineerId] = useState(0);

    useEffect(() => {
        fetchRepairRecords();
        fetchEngineers();
    }, []);

    const fetchEngineers = async () => {
        try {
            const response = await axios.get(`${config.apiUrl}/api/user/listEngineer`);
            setEngineers(response.data);
            if (response.data.length > 0) {
                setEngineerId(response.data[0].id);
            }
            setEngineerId(response.data[0].id);
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'error',
                text: error.message,
            });
        }
    }

    const fetchRepairRecords = async () => {
        try {
            const response = await axios.get(`${config.apiUrl}/api/repairRecord/list`);
            setRepairRecords(response.data);
            setTempRepairRecords(response.data);
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'error',
                text: error.message,
            });
        }
    }

    const getStatusName = (status: string) => {
        const statusObj = statusList.find((item: any) => item.value === status);
        return statusObj?.label ?? 'Waiting for repair';
    };

    const handleEdit = (id: number) => {
        const repairRecord = repairRecords.find((repairRecord: any) => repairRecord.id === id) as any;

        if (repairRecord) {
            setEngineerId(repairRecord?.engineerId ?? 0); // กำหนดช่างซ่อมตามสถานะที่มีอยู่

            setId(id);
            setStatus(repairRecord?.status ?? '');
            setSolving(repairRecord?.solving ?? '');
            setShowModal(true);
        }
    }

    const handleSave = async () => {
        try {
            const payload = {
                status: status,
                solving: solving,
                engineerId: engineerId
            }

            await axios.put(`${config.apiUrl}/api/repairRecord/updateStatus/${id}`, payload);
            fetchRepairRecords();
            setShowModal(false);
        } catch (error: any) {
            Swal.fire({ icon: 'error', title: 'error', text: error.message });
        }
    }

    const handleFilter = (statusForFilter: string) => {
        if (statusForFilter) {
            const filteredRecords = tempRepairRecords.filter((repairRecord: any) => repairRecord.status === statusForFilter);
            setRepairRecords(filteredRecords);
            setStatusForFilter(statusForFilter);
        } else {
            setRepairRecords(tempRepairRecords);
            setStatusForFilter('');
        }
    }

    return (
        <>
            <div className="card">
                <h1>Repair Status</h1>
                <div>
                    <select className="form-control" value={statusForFilter} 
                    onChange={(e) => handleFilter(e.target.value)}>
                        <option value="">--- All ---</option>
                        {statusList.map((item: any) => (
                            <option value={item.value} key={item.value}>{item.label}</option>
                        ))}
                    </select> 
                </div>
                <div className="card-body">
                    <table className="table mt-3">
                        <thead>
                            <tr>
                                <th>EN.</th>
                                <th>Device Name</th>
                                <th>Problem</th>
                                <th>StartJobDate</th>
                                <th>Tech</th>
                                <th>EndJobDate</th>
                                <th>Status</th>
                                <th style={{ width: '170px' }} className="text-center">Manage Status</th>
                            </tr>                          
                        </thead>
                        <tbody>
                            {repairRecords.map((repairRecord: any) => 
                                <tr key={repairRecord.id}>
                                    <td>{repairRecord.customerName}</td>
                                    <td>{repairRecord.deviceName}</td>
                                    <td>{repairRecord.problem}</td>
                                    <td>{dayjs(repairRecord.createdAt).format('DD/MM/YYYY HH:mm')}</td>
                                    <td>{repairRecord.engineer?.username ?? '-'}</td>
                                    <td>{repairRecord.endJobDate ? dayjs(repairRecord.endJobDate).format('DD/MM/YYYY HH:mm') : '-'}</td>
                                    <td>{getStatusName(repairRecord.status)}</td>
                                    <td className="text-center">
                                        <button className="btn-edit" onClick={() => handleEdit(repairRecord.id)}>
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
                    <div className="flex gap-4">
                        <div className="w-1/2">
                        <div>Select Status</div>
                            <div>
                                <select className="form-control w-full" value={status} onChange={(e) => setStatus(e.target.value)}>
                                    {statusList.map((item) => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="w-1/2">
                        <div>Select Technician</div> 
                            <div>
                                <select className="form-control w-full" value={engineerId} 
                                    onChange={(e) => setEngineerId(Number(e.target.value))}>
                                    <option value="0">Select Technician</option>
                                    {engineers.map((engineer: any) => (
                                        <option value={engineer.id} key={engineer.id}>
                                            {engineer.username}
                                        </option>
                                    ))}
                                </select>
                            </div> 
                        </div>
                    </div>
                    
                    
                           
                    
                    <div className="mt-3">
                        <div>Solve the problem</div>
                        <textarea className="form-control w-full" rows={5} 
                        value={solving} onChange={(e) => setSolving(e.target.value)}></textarea> 
                    </div>
                    <button className="btn-primary mt-3" onClick={handleSave}>
                        <i className="fa-solid fa-save mr-3"></i>
                        Save
                    </button>
                </div>
            </Modal>
        </>
       
    )
}