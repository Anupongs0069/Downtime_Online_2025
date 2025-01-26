'use client';

import { useState, useEffect } from "react";
import { config } from "../../config";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/app/components/modal";
import dayjs from "dayjs";

export default function Page() {
    const [devices, setDevices] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [product, setProduct] = useState('');
    const [family, setFamily] = useState('');
    const [importDate, setImportDate] = useState('');
    const [remark, setRemark] = useState('');
    const [id, setId] = useState(0);
    
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(config.apiUrl + "/api/device/list");
            setDevices(res.data);
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message
            });
        }
    }

    const handleShowModal = () => {
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }

    const handleSave = async () => {
        try {
            const payload = {
                name: name,
                product: product,
                family: family,
                importDate: new Date(importDate),
                remark: remark
            }

            if (id == 0) {
                await axios.post(config.apiUrl + "/api/device/create", payload);
            } else {
                await axios.put(config.apiUrl + "/api/device/update/" + id , payload);
            }
            
            setShowModal(false);
            setName('');
            setProduct('');
            setFamily('');
            setImportDate('');
            setRemark('');
            setId(0);
            
            fetchData();
            
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message
            });
        }
    }

    const handleEdit = (item: any) => {
        setName(item.name);
        setProduct(item.product);
        setFamily(item.family);
        setImportDate(item.importdate);
        setRemark(item.remark);
        setId(item.id);

        handleShowModal();
    }

    const handleDelete = async (id: string) => {
        try {
            const button = await config.confirmDialog();           
            
            if (!button.isConfirmed) {
                await axios.delete(config.apiUrl + '/api/device/remove/' + id);
                fetchData();
            }
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message
            });
        }
    }

    return (
        <div className="card">
            <h1>Device</h1>
            <div className="card-body">
                <button className="btn btn-primary" onClick={handleShowModal}>
                    <i className="fa-solid fa-plus mr-3"></i>
                    Add Device
                </button>

                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Product</th>
                            <th>Family</th>
                            <th>Import Date</th>
                            <th>Remark</th>
                            <th style={{width: '130px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {devices.map((item: any) => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.product}</td>
                                <td>{item.family}</td>
                                <td>{dayjs(item.importDate).format('DD/MM/YYYY')}</td>
                                <td>{item.remark}</td>
                                
                                <td className="text-center">
                                    <button className="btn-edit" onClick={() => handleEdit(item)}>
                                        <i className="fa-solid fa-pen-to-square"></i>
                                        
                                    </button>
                                    <button className="btn-delete" onClick={() => handleDelete(item.id)}>
                                        <i className="fa-solid fa-trash"></i>
                                        
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal title="Add Device" isOpen={showModal} onClose={handleCloseModal}>
                <div>Name Device</div>
                <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />   

                <div className="mt-3">Product</div>
                <input type="text" className="form-control" value={product} onChange={(e) => setProduct(e.target.value)} />               

                <div className="mt-3">Family</div>
                <input type="text" className="form-control" value={family} onChange={(e) => setFamily(e.target.value)} />

                <div className="mt-3">Import Date</div>
                <input type="date" className="form-control" value={importDate} onChange={(e) => setImportDate(e.target.value)} />

                <div className="mt-3">Remark</div>
                <input type="text" className="form-control" value={remark} onChange={(e) => setRemark(e.target.value)} />

                <button className="btn btn-primary mt-5" onClick={handleSave}>
                    <i className="fa-solid fa-save mr-3"></i>
                    Save
                </button>
            </Modal>
        </div>
    )
}