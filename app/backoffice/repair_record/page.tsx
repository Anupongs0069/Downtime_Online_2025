'use client';

import { useEffect, useState } from "react";
import Modal from "@/app/components/modal";
import axios from "axios";
import Swal from "sweetalert2";
import config from "@/app/config";
import dayjs from "dayjs";

export default function Page() {
    const [repairRecords, setRepairRecords] = useState([]);
    const [devices, setDevices] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [deviceName, setDeviceName] = useState('');
    const [deviceProduct, setDeviceProduct] = useState('');
    const [deviceFamily, setdeviceFamily] = useState('');
    const [problem, setProblem] = useState('');
    const [solving, setSolving] = useState('');
    const [deviceId, setDeviceId] = useState('');
    const [userId, setUserId] = useState('');
    const [user, setUser] = useState('');
    const [engineerId, setEngineerId] = useState('');
    const [status, setStatus] = useState('');
    const [id, setId] = useState(0);

    useEffect(() => {
        fetchDevices();
        fetchRepairRecords();
    }, []);

    const fetchDevices = async () => {
        const response = await axios.get(`${config.apiUrl}/api/device/list`);
        setDevices(response.data);
    }

    const openModal = () => {
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
        setId(0);
    }

    const fetchRepairRecords = async () => {
        const response = await axios.get(`${config.apiUrl}/api/repair_record/list`);
        setRepairRecords(response.data);
    }

    const handleDeviceChange = (deviceId: string) => {
        const device = (devices as any).find((device: any) => device.id === parseInt(deviceId));

        if (device) {
            setDeviceId(device.id);
            setDeviceName(device.name);
            setDeviceProduct(device.product);
            setdeviceFamily(device.family);
        } else {
            setDeviceId('');
            setDeviceName('');
            setDeviceProduct('');
            setdeviceFamily('');
        }
    }

    const handleSave = async () => {
        const payload = {
            customerName: customerName,
            deviceId: deviceId == '' ? undefined : deviceId,
            deviceName: deviceName,
            deviceProduct: deviceProduct,
            deviceFamily: deviceFamily,
            problem: problem,
            solving: solving
        }

        try {
            if (id == 0) {
                await axios.post(`${config.apiUrl}/api/repair_record/create`, payload);
            } else {
                await axios.put(`${config.apiUrl}/api/repair_record/update/${id}`, payload);
                setId(0);
            }
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Repair record created successfully',
                timer: 1000
            })

            closeModal();
            fetchRepairRecords();

        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
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
            case 'success':
                return 'Successfully';
            case 'cancel':
                return 'Cancel';
            default:
                return 'Waiting for repair'
        }
    }

    const handleEdit = (repairRecord: any) => {
        setId(repairRecord.id);
        setCustomerName(repairRecord.customerName);

        if (repairRecord.deviceId) {
            setDeviceId(repairRecord.deviceId);
        }
       
        setDeviceName(repairRecord.deviceName);
        setDeviceProduct(repairRecord.deviceProduct);
        setdeviceFamily(repairRecord.deviceFamily);
        setProblem(repairRecord.problem);
        openModal();
    }

    const handleDelete = async (id: number) => {
        const button = await config.confirmDialog();

        if (button.isConfirmed) {
            await axios.delete(`${config.apiUrl}/api/repair_record/remove/${id}`);
            fetchRepairRecords();
        }
    }

    return (
        <>
            <div className="card">
                <h1>Repair records</h1>
                <div className="card-body">
                    <button className="btn-primary" onClick={openModal}>
                        <i className="fa-solid fa-plus mr-3"></i>
                        Add Repair
                    </button>

                    <table className="table mt-3">
                        <thead>
                            <tr>
                                <th>EN.</th>
                                <th>Device</th>
                                <th>Product</th>
                                <th>Family</th>
                                <th>Problem</th>
                                <th>Start JobDate</th>
                                <th>End JobDate</th>
                                <th>Status</th>
                                <th style={{ width: '230px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {repairRecords.map((repairRecord: any, index: number) => (
                                <tr key={index}>
                                    <td>{repairRecord.customerName}</td>
                                    <td>{repairRecord.deviceName}</td>
                                    <td>{repairRecord.deviceProduct}</td>
                                    <td>{repairRecord.deviceFamily}</td>
                                    <td>{repairRecord.problem}</td>
                                    <td>{dayjs(repairRecord.createdAt).format('DD/MM/YYYY HH:mm')}</td>
                                    <td>{repairRecord.endJobDate ? dayjs(repairRecord.endJobData).format('DD/MM/YYYY'): '-'}</td>
                                    <td>{getStatusName(repairRecord.status)}</td>
                                    <td>
                                        <button className="btn-edit" onClick={() => handleEdit(repairRecord)}>
                                            <i className="fa-solid fa-edit mr-3"></i>
                                            Edit
                                        </button>
                                        <button className="btn-delete" onClick={() => handleDelete(repairRecord.id)}>
                                            <i className="fa-solid fa-trash mr-3"></i>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        
                    </table>
                </div>
            </div>
            <Modal title='Add Repair Record' isOpen={showModal} 
                onClose={() => closeModal()} size='xl'>
               
                <div className="mt-4">EN.</div>    
                <input className="form-control w-full" type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                    
                    {/* <div className="w-1/2">
                        <div>Device Name</div>
                        <input className="form-control w-full" type="text" />
                  </div>                    */}
                

                <div className="mt-4">Device In System</div>
                <select className="form-control w-full" value={deviceId} onChange={(e) => handleDeviceChange(e.target.value)} >
                    <option value="">--- Select Device ---</option>
                    {devices.map((device: any) => (
                        <option key={device.id} value={device.id}>{device.name}</option>
                    ))}
                </select>
                    
                <div className="mt-4">Device Out System</div>
                <input type="text" className="form-control w-full" value={deviceName} onChange={(e) => setDeviceName(e.target.value)} />

                <div className="flex gap-4 mt-4">
                    <div className="w-1/2">
                        <div>Product</div>
                        <input type="text" className="form-control w-full" value={deviceProduct} onChange={(e) => setDeviceProduct(e.target.value)} />
                    </div>
                    <div className="w-1/2">
                        <div>Family</div>
                        <input type="text" className="form-control w-full" value={deviceFamily} onChange={(e) => setdeviceFamily(e.target.value)} />
                    </div>
                </div>
                <div className="mt-4">Problem</div>
                <textarea className="form-control w-full" value={problem} onChange={(e) => setProblem(e.target.value)}></textarea>
                <button className="btn-primary mt-4" onClick={handleSave}>
                    <i className="fa-solid fa-floppy-disk mr-3"></i>
                    Save
                </button>
            </Modal>
                    
        </>
    )
}