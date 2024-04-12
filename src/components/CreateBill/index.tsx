import { useContext, useEffect, useState } from 'react';
import { ToastContainer, ToastOptions, toast } from 'react-toastify';
import { Button, Input, Modal, Select, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import StoreContext from '../../store';
import { STORE_LIST_PRODUCT } from '../../store/type';
import ModalDetailBill from '../ModalDetailBill';
import './styles.scss';
import { SearchOutlined } from '@ant-design/icons';

const CreateBill = () => {
    const store = useContext(StoreContext);
    const data = store.listProduct;
    const [modal, setModal] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const notify = (message: string, options: ToastOptions<unknown> | undefined) => toast(message, options);
    const [infoBill, setInfoBill] = useState<{
        selectedProducts: { id_sanpham: string, quantity: number, [k: string]: any }[],
        customer: string
    }>({
        selectedProducts: [],
        customer: ''
    });
    const rowSelection = {
        selectedProductKeys: infoBill.selectedProducts,
        onChange: (newSelectedProductKeys: Array<any>) => {
            setInfoBill({
                ...infoBill,
                selectedProducts: newSelectedProductKeys.map((item) => {
                    const findE = (data.sanpham as Array<any>)?.find((prd) => prd.id_sanpham === item);
                    const findExisted = infoBill.selectedProducts.find((slc => slc.id_sanpham === item));
                    return {
                        id_sanpham: item,
                        quantity: findExisted?.quantity ?? 0,
                        price: findE?.gia_final,
                        weight: findE?.trong_luong_final,
                        ten: findE?.ten,
                    }
                })
            });
        },
    };
    const handleChangeQuantityProduct = (id_sanpham: string, quantity: number) => {
        const findRecordProduct = infoBill.selectedProducts.find(item => item.id_sanpham === id_sanpham);
        if (findRecordProduct) {
            findRecordProduct.quantity = quantity;
            setInfoBill({ ...infoBill });
        }
    }
    const columns: ColumnsType<any> = [
        {
            key: 'ID',
            title: 'ID',
            dataIndex: 'id_sanpham'
        },
        {
            key: 'productName',
            title: 'Tên sản phẩm',
            dataIndex: 'ten'
        },
        {
            key: 'PRICE',
            title: 'Giá',
            dataIndex: 'gia',
            render(value) {
                return Number(value).toFixed(2) ?? 0;
            }
        },
        {
            key: 'QUANTITY',
            title: 'Số lượng',
            render(_, record) {
                return <Input
                    size="small"
                    type='number'
                    min={0}
                    value={infoBill.selectedProducts.find(item => item.id_sanpham === record?.id_sanpham)?.quantity}
                    onChange={(e) => {
                        handleChangeQuantityProduct(record?.id_sanpham as string, Number(e.target.value));
                    }}
                    disabled={!infoBill.selectedProducts.find(item => item.id_sanpham === record?.id_sanpham)}
                />
            }
        }
    ];
    const rowData = (data?.sanpham as Array<any>)?.map((item) => {
        return {
            ...item,
            key: item.id_sanpham
        }
    });
    const queryDataProduct = async () => {
        try {
            const query = await axios.get('https://tanphong.onrender.com/sanpham/');
            const data = await query.data;
            store.dispatch({
                type: STORE_LIST_PRODUCT,
                payload: data
            });
        } catch (error) {
            store.dispatch({
                type: STORE_LIST_PRODUCT,
                payload: []
            });
        }
    };
    const onChange = (value: string) => {
        setInfoBill({
            ...infoBill,
            customer: value
        });
    };

    const filterOption = (input: string, option?: { label: string; value: string }) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    useEffect(() => {
        queryDataProduct();
    }, []);
    return (
        <div className="createBill">
            <div className="searchBar">
                <Input type='text' prefix={<SearchOutlined />} className='searchInput' onChange={((e) => {
                    setSearchValue(e.target.value);
                })} />
            </div>
            <Table
                rowSelection={rowSelection}
                loading={!data}
                columns={columns}
                dataSource={!searchValue ? rowData : rowData.filter((data) => {
                    return String(data.ten).toLowerCase().includes(searchValue.toLowerCase()) || String(data.id_sanpham).toLowerCase().includes(searchValue.toLowerCase());
                })}
            />
            <div className='handle'>
                <label className='selectUser'>
                    <Select
                        showSearch
                        placeholder="Select a person"
                        optionFilterProp="children"
                        onChange={onChange}
                        filterOption={filterOption}
                        options={(data?.khachhang as Array<any>)?.map((item => {
                            return {
                                value: item.id_khachhang,
                                label: item.ten
                            }
                        }))}
                    />
                    <span className="required">*</span>
                </label>
                <Button
                    onClick={() => {
                        if (!infoBill.customer || !infoBill.selectedProducts.length) {
                            notify(!infoBill.customer ? 'Chưa chọn khách hàng' : 'Chưa chọn sản phẩm', {
                                type: 'warning'
                            });
                        } else {
                            setModal(true);
                        }
                    }}
                >
                    Tạo đơn
                </Button>
            </div>
            <ToastContainer />
            {modal && <Modal
                width={'90vw'}
                centered
                open={modal}
                onCancel={() => {
                    setModal(false);
                }}
                footer={false}
            >
                <ModalDetailBill data={infoBill} setModal={setModal} />
            </Modal>
            }
        </div>
    )
}

export default CreateBill;