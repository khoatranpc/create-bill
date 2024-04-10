import { Button, Checkbox, Form, Input, Table } from 'antd';
import { useContext, useState } from 'react';
import StoreContext from '../../store';
import './styles.scss';
import { useFormik } from 'formik';
import axios from 'axios';

interface Props {
    data: any;
    setModal: (open: boolean) => void;
}
const createBill = async (dataBody: any) => {
    const data = await axios.post('https://tanphong.onrender.com/donhang/', dataBody);
    return data.data;
}
const ModalDetailBill = (props: Props) => {
    const store = useContext(StoreContext);
    const [loadingCreate, setLoadingCreate] = useState(false);
    const data = store.listProduct;
    const getColumnsBill = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'ten',
            key: 'NAME'
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity'
        },
    ];
    const { values, handleChange, handleBlur, handleSubmit, setFieldValue } = useFormik({
        initialValues: {
            contract: '',
            shippingLine: '',
            shippedPer: '',
            consignee: '',
            portOfLoading: '',
            placeOfDelivery: '',
            sailingOn: '',
            bookingOn: '',
            billOfLadingNo: '',
            containerSealNo: '',
            packaging: (data.packagking as Array<any>)?.map((item) => item.id_chiphi) ?? [],
            chiphi: (data.chiphi as Array<any>)?.map((item) => item.id_chiphi) ?? []
        },
        async onSubmit(values) {
            const getData = {
                customer: props.data.customer,
                listProduct: (props.data.selectedProducts as Array<any>)?.map((item) => {
                    return {
                        ...item,
                        idProduct: item.id_sanpham
                    }
                }) ?? [],
                ...values
            };
            setLoadingCreate(true);
            const createdBill = await createBill(getData);
            if (createdBill) {
                props.setModal(false);
                window.open('https://create-bill-pziw.onrender.com/bill', '_blank');
                localStorage.setItem('createdBill', JSON.stringify(createdBill));
                setLoadingCreate(false);
            }
        }
    });
    return (
        <div className="detailBill">
            <Form
                className="bill"
                onFinish={handleSubmit}
            >
                <div className="left">
                    <Form.Item>
                        <label>
                            Tên khách hàng
                        </label>
                        <p><b>{(data.khachhang as Array<any>)?.find(item => item.id_khachhang === props.data.customer)?.ten}</b></p>
                    </Form.Item>
                    <Table
                        columns={getColumnsBill}
                        dataSource={(props.data.selectedProducts as Array<any>)?.map((item) => {
                            return {
                                ...item,
                                key: item.id_sanpham
                            }
                        })}
                        pagination={false}
                    />
                    <div className="moreOptional">
                        <div className="left">
                            <label>Packaging</label>
                            <Checkbox.Group
                                className="checkboxOption"
                                defaultValue={values.packaging}
                                onChange={(value) => {
                                    setFieldValue('packagking', value);
                                }}
                            >
                                {(data.packagking as Array<any>)?.map((item) => {
                                    return <Checkbox key={item.id_chiphi} value={item.id_chiphi}>{item.ten}</Checkbox>
                                })}
                            </Checkbox.Group>
                        </div>
                        <div className="right">
                            <label>Gia công</label>
                            <Checkbox.Group
                                className="checkboxOption"
                                defaultValue={values.chiphi}
                                onChange={(value) => {
                                    setFieldValue('chiphi', value)
                                }}
                            >
                                {(data.chiphi as Array<any>)?.map((item) => {
                                    return <Checkbox key={item.id_chiphi} value={item.id_chiphi}>{item.ten}</Checkbox>
                                })}
                            </Checkbox.Group>
                        </div>
                    </div>
                </div>
                <div className="right">
                    <Form.Item>
                        <label>Contract</label>
                        <Input size="small" name="contract" onChange={handleChange} onBlur={handleBlur} value={values.contract} />
                    </Form.Item>
                    <Form.Item>
                        <label>Shipping Line</label>
                        <Input size="small" name="shippingLine" onChange={handleChange} onBlur={handleBlur} value={values.shippingLine} />
                    </Form.Item>
                    <Form.Item>
                        <label>Shipped Per</label>
                        <Input size="small" name="shippedPer" onChange={handleChange} onBlur={handleBlur} value={values.shippedPer} />
                    </Form.Item>
                    <Form.Item>
                        <label>Consignee</label>
                        <Input size="small" name="consignee" onChange={handleChange} onBlur={handleBlur} value={values.consignee} />
                    </Form.Item>
                    <Form.Item>
                        <label>Port of loading</label>
                        <Input size="small" name="portOfLoading" onChange={handleChange} onBlur={handleBlur} value={values.portOfLoading} />
                    </Form.Item>
                    <Form.Item>
                        <label>Place of Delivery</label>
                        <Input size="small" name="placeOfDelivery" onChange={handleChange} onBlur={handleBlur} value={values.placeOfDelivery} />
                    </Form.Item>
                    <Form.Item>
                        <label>Sailing on</label>
                        <Input size="small" name="sailingOn" onChange={handleChange} onBlur={handleBlur} value={values.sailingOn} />
                    </Form.Item>
                    <Form.Item>
                        <label>Booking No</label>
                        <Input type="number" size="small" name="bookingOn" onChange={handleChange} onBlur={handleBlur} value={values.bookingOn} />
                    </Form.Item>
                    <Form.Item>
                        <label>Bill of lading no</label>
                        <Input size="small" name="billOfLadingNo" onChange={handleChange} onBlur={handleBlur} value={values.billOfLadingNo} />
                    </Form.Item>
                    <Form.Item>
                        <label>Container/Seal no</label>
                        <Input size="small" name="containerSealNo" onChange={handleChange} onBlur={handleBlur} value={values.containerSealNo} />
                    </Form.Item>
                    <Button htmlType="submit" loading={loadingCreate}>Tạo đơn</Button>
                </div>
            </Form>
        </div>
    )
}

export default ModalDetailBill;