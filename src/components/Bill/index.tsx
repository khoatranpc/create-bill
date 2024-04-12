import { useRef, useState } from 'react';
import { Button, Table } from 'antd';
import { useReactToPrint } from 'react-to-print';
import { ColumnsType } from 'antd/es/table';
import { numberToWords } from '../../utils';
import logo from '../../assets/img.png';
import './styles.scss';

enum BillView {
    INVOICE = 'INVOICE',
    PACKING = 'PACKING'
}
const initData: any = {
    contractno: "Contract No",
    khachhang: "For Account and Risk of Messrs",
    shippingline: "Shipping Line",
    shippedper: "Shipped Per",
    portofloading: "Port of loading",
    placeofdelivery: "Place of Delivery",
    sailingon: "Sailing on",
    bookingno: "Booking No",
    billofladingno: "Bill of lading no",
    container_sealno: "Container/Seal No"
}
const Bill = () => {
    const [typeBill, setTypeBill] = useState<BillView>(BillView.INVOICE);
    const getDataBill = JSON.parse(localStorage.getItem('createdBill') as string)?.DonHang as any;
    const getDetailBill = JSON.parse(localStorage.getItem('createdBill') as string)?.ChiTietDonHang as Array<any>;
    const rowData = getDetailBill?.map((item, idx) => {
        return {
            ...item,
            key: item.id_chitietdonhang,
            no: idx + 1,
            colSpan: 1
        }
    });
    const billRef = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => billRef.current,
        bodyClass: 'printPageBill'
    });

    const lastRow = [
        {
            key: 'TOTAL',
            ten_sanpham: 'TOTAL',
            trongluongnet_kg_field: getDataBill?.tongsoluong,
            tonggiasanpham: getDataBill?.tonggia,
            colSpan: 1
        },
        {
            ten_sanpham: `Say in Total: US  Dollars  ${numberToWords(String(Number(getDataBill?.tonggia).toFixed(2)))}`,
            colSpanten_sanpham: 4,
            colSpantrongluongnet_kg_field: 0,
            colSpangiasanpham_kg: 0,
            colSpantonggiasanpham: 0,
            key: 'TEXT',
        }
    ];
    if (typeBill === BillView.INVOICE) {
        rowData.push(...lastRow);
    } else {
        const lastRow = rowData.reduce((prev, current) => {
            return {
                soluongthung: prev.soluongthung + current.soluongthung,
                soluongchai: prev.soluongchai + current.soluongchai,
                trongluongnet_kg_field: prev.trongluongnet_kg_field + current.trongluongnet_kg_field,
                trongluonggross_kg_field: prev.trongluonggross_kg_field + current.trongluonggross_kg_field
            }
        }, {
            soluongthung: 0,
            soluongchai: 0,
            trongluongnet_kg_field: 0,
            trongluonggross_kg_field: 0
        });
        rowData.push({
            ...lastRow,
            key: 'LASTROW'
        });
    }
    const columns: ColumnsType<any> = [
        {
            key: 'ID',
            title: 'ID',
            dataIndex: 'id_sanpham'
        },
        {
            key: 'NO',
            title: 'No',
            dataIndex: 'no',
            className: 'text-center'
        },
        {
            key: 'CND',
            title: 'Commodity & Description',
            dataIndex: 'ten_sanpham',
            className: 'th-text-center',
            onCell(data) {
                return {
                    colSpan: data[`colSpanten_sanpham`] ?? 1
                }
            },
        },
        ...typeBill === BillView.INVOICE ? [{
            key: 'NW',
            title: 'Net Weight (Kgs)',
            dataIndex: 'trongluongnet_kg_field',
            className: 'th-text-center',
            render(value: any) {
                return value ? Number(value).toFixed(2) : 0;
            },
            onCell(data: any) {
                return {
                    className: 'cell-text-center',
                    colSpan: data[`colSpantrongluongnet_kg_field`] ?? 1
                }
            },
        },
        {
            key: 'UPC',
            title: 'Unit Price CNF USA (USD)',
            dataIndex: 'giasanpham_kg',
            className: 'th-text-center',
            render(value: any) {
                return value ? Number(value).toFixed(2) : 0;
            },
            onCell(data: any) {
                return {
                    className: 'cell-text-right',
                    colSpan: data[`colSpangiasanpham_kg`] ?? 1
                }
            }
        },
        {
            key: 'TA',
            title: 'Total amount (USD)',
            dataIndex: 'tonggiasanpham',
            className: 'th-text-center',
            render(value: any) {
                return value ? Number(value).toFixed(2) : 0;
            },
            onCell(data: any) {
                return {
                    className: 'cell-text-center',
                    colSpan: data[`colSpantonggiasanpham`] ?? 1
                }
            }
        }] : [
            {
                key: 'QTT',
                title: 'Quantity of Packages (PKGS)',
                className: 'th-text-center',
                dataIndex: 'soluongthung',
                render(value: any) {
                    return value ?? 0
                },
                onCell() {
                    return {
                        className: 'cell-text-right'
                    }
                }
            },
            {
                key: 'QTTOB',
                title: 'Quantity of bottles',
                className: 'th-text-center',
                dataIndex: 'soluongchai',
                render(value: any) {
                    return value ?? 0
                },
                onCell() {
                    return {
                        className: 'cell-text-right'
                    }
                }
            },
            {
                key: 'WOP',
                title: 'Weight of package',
                className: 'th-text-center',
                children: [
                    {
                        key: 'NET',
                        title: 'Net (Kgs)',
                        className: 'th-text-center',
                        dataIndex: 'trongluongnet_thung_kg_field',
                        render(value: any) {
                            return Number(value) ? Number(value).toFixed(2) ?? 0 : ''
                        },
                        onCell() {
                            return {
                                className: 'cell-text-right'
                            }
                        }
                    },
                    {
                        key: 'GROSS',
                        title: 'Gross (Kgs)',
                        className: 'th-text-center',
                        dataIndex: 'trongluonggross_thung_kg_field',
                        render(value: any) {
                            return Number(value) ? Number(value).toFixed(2) ?? 0 : ''
                        },
                        onCell() {
                            return {
                                className: 'cell-text-right'
                            }
                        }
                    },
                ]
            },
            {
                key: 'TTW',
                title: 'Total Weight',
                children: [
                    {
                        key: 'NET',
                        title: 'Net (Kgs)',
                        className: 'th-text-center',
                        dataIndex: 'trongluongnet_kg_field',
                        render(value: any) {
                            return Number(value) ? Number(value).toFixed(2) ?? 0 : ''
                        },
                        onCell() {
                            return {
                                className: 'cell-text-right'
                            }
                        }
                    },
                    {
                        key: 'GROSS',
                        title: 'Gross (Kgs)',
                        className: 'th-text-center',
                        dataIndex: 'trongluonggross_kg_field',
                        render(value: any) {
                            return Number(value) ? Number(value).toFixed(2) ?? 0 : ''
                        },
                        onCell() {
                            return {
                                className: 'cell-text-right'
                            }
                        }
                    },
                ]
            },
        ]
    ];

    const handleChangeBill = (type: BillView) => {
        setTypeBill(type);
    }
    return (
        <div className="pagePrintBill">
            <div className="selectBill">
                <span className={typeBill === BillView.INVOICE ? 'active' : ''} onClick={() => { handleChangeBill(BillView['INVOICE']) }}>Invoice</span>
                <span className={typeBill === BillView.PACKING ? 'active' : ''} onClick={() => { handleChangeBill(BillView['PACKING']) }}>Packing List</span>
                <Button onClick={() => {
                    handlePrint();
                }}>In</Button>
            </div>
            <div className="viewBill" ref={billRef} style={{ maxWidth: '100%' }}>
                <div className="content">
                    <div className="img">
                        <img src={logo} alt="" className="imgLogo" />
                    </div>
                    <h1>{typeBill === BillView.INVOICE ? 'COMMERCIAL INVOICE' : 'Packing List'}</h1>
                    <div className="date">
                        Date: 08/10/2023
                        <br />
                        No: 08/10/2023/TPC
                    </div>
                    <div className="informationBill">
                        {getDataBill && Object.keys(initData).map((item, idx) => {
                            return <div key={idx} className="row">
                                <div className='left'>{initData[item]}:</div>
                                <div className='right'>{item === "khachhang" ? `${getDataBill[item].ten} ${getDataBill[item].diachi} ${getDataBill[item].zipcode} ${getDataBill[item].quocgia} ${getDataBill[item].sdt}` : getDataBill[item]}</div>
                            </div>
                        })}
                    </div>
                    <Table
                        bordered
                        className="table"
                        dataSource={rowData}
                        columns={columns}
                        pagination={false}
                    />
                    {typeBill === BillView.INVOICE && <p className='textPay'>Payment shall be made by T.T .through Joint Stock Commercial Bank For Foreign Trade of Vietnam, Viet Tri Branch to Tan Phong Joint Stock Company’s Account No. 080 137 000 6888. Swift code: BFTVVNVX080.</p>}
                    <p className="forCompany">For and on behalf of Tan Phong Joint Stock Co.</p>
                </div>
            </div>
        </div>
    )
}

export default Bill;