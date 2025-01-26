'use client';

import { useEffect, useState } from "react";
import Modal from "@/app/components/modal";
import axios from "axios";
import Swal from "sweetalert2";
import config from "@/app/config";

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

    useEffect(() => {
        fetchDevices();
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
            await axios.post(`${config.apiUrl}/api/repair_record/create`, payload);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Repair record created successfully',
                timer: 1000
            })
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message
            });
        }
    }

    return (
        <div>
            <div className="card">
                <h1>Repair records</h1>
                <div className="card-body">
                    <button className="btn-primary" onClick={openModal}>
                        <i className="fa-solid fa-plus mr-3"></i>
                        Add Repair
                    </button>
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
                    
        </div>
    )
}