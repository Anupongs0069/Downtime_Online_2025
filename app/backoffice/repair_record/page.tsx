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
    const [id, setId] = useState(0);

    //
    // รับเครื่อง
    //
    const [showModalReceive, setShowModalReceive] = useState(false);
    const [receiveCustomerName, setReciveCustomerName] = useState('');
    const [receiveId, setRecdiveId] =useState(0);


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
        const response = await axios.get(`${config.apiUrl}/api/repairRecord/list`);
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
                await axios.post(`${config.apiUrl}/api/repairRecord/create`, payload);
            } else {
                await axios.put(`${config.apiUrl}/api/repairRecord/update/${id}`, payload);
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
                return 'Success';
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
            await axios.delete(`${config.apiUrl}/api/repairRecord/remove/${id}`);
            fetchRepairRecords();
        }
    }

    const openModalReceive = (repairRecord: any) => {
        setShowModalReceive(true);
        setReciveCustomerName(repairRecord.customerName);
        setRecdiveId(repairRecord.id);
    }

    const closeModalReceive = () => {
        setShowModalReceive(false);
        setRecdiveId(0); //clear id
    }

    const handleReceive = async () => {
        const payload = {
            id: receiveId
        }

        await axios.put(`${config.apiUrl}/api/repairRecord/receive`, payload);
        fetchRepairRecords();
        closeModalReceive();
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
                                <th>StartJobDate</th>
                                <th>EndJobDate</th>
                                <th>Status</th>
                                <th style={{ width: '200px' }}></th>
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
                                    <td>{repairRecord.endJobDate ? dayjs(repairRecord.endJobData).format('DD/MM/YYYY HH:mm') : '-'}</td>
                                    <td>{getStatusName(repairRecord.status)}</td>
                                    <td>
                                        <button className="btn-edit" onClick={() => openModalReceive(repairRecord)}>
                                            <i className="fa-solid fa-check"></i>
                                            
                                        </button>
                                        <button className="btn-edit" onClick={() => handleEdit(repairRecord)}>
                                            <i className="fa-solid fa-edit"></i>
                                            
                                        </button>
                                        <button className="btn-delete" onClick={() => handleDelete(repairRecord.id)}>
                                            <i className="fa-solid fa-trash"></i>
                                            
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
                <input className="form-control w-full" type="text" value={customerName} 
                onChange={(e) => setCustomerName(e.target.value)} />
                
                <div className="mt-4">Device In System</div>
                <select className="form-control w-full" value={deviceId} 
                onChange={(e) => handleDeviceChange(e.target.value)} >
                    <option value="">--- Select Device ---</option>
                    {devices.map((device: any) => (
                        <option key={device.id} value={device.id}>{device.name}</option>
                    ))}
                </select>
                    
                <div className="mt-4">Device Out System</div>
                <input type="text" className="form-control w-full" value={deviceName} 
                onChange={(e) => setDeviceName(e.target.value)} />

                <div className="flex gap-4 mt-4">
                    <div className="w-1/2">
                        <div>Product</div>
                        <input type="text" className="form-control w-full" value={deviceProduct} 
                        onChange={(e) => setDeviceProduct(e.target.value)} />
                    </div>
                    <div className="w-1/2">
                        <div>Family</div>
                        <input type="text" className="form-control w-full" value={deviceFamily} 
                        onChange={(e) => setdeviceFamily(e.target.value)} />
                    </div>
                </div>
                <div className="mt-4">Problem</div>
                <textarea className="form-control w-full" value={problem} 
                onChange={(e) => setProblem(e.target.value)}></textarea>
                <button className="btn-primary mt-4" onClick={handleSave}>
                    <i className="fa-solid fa-floppy-disk mr-3"></i>
                    Save
                </button>
            </Modal>

            <Modal title="Check Ok" isOpen={showModalReceive} onClose={() => closeModalReceive()} size="xl">
                <div className="w-full">
                    <div>
                        <div>Name</div>
                        <input type="text" className="form-control w-full disabled" readOnly
                            value={receiveCustomerName} />
                    </div>
                </div>
                <div>
                    <button className="btn-primary mt-4" onClick={handleReceive}>
                        <i className="fa-solid fa-save mr-3"></i>
                        Save
                    </button>
                </div>
            </Modal>
                    
        </>
    )
}