import React, { useState, useMemo } from 'react';
import { Table, Button, Space, Modal, Form, Input, DatePicker, InputNumber } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { useTableStore } from './store/useTableStore';
import type { TableRecord } from './store/useTableStore';

const App: React.FC = () => {
  const { records, deleteRecord, addRecord } = useTableStore();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form] = Form.useForm();

  const columns: ColumnsType<TableRecord> = useMemo(() => [
    {
      title: 'Имя',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Дата',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Значение',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => console.log(record.id)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => deleteRecord(record.id)}
          />
        </Space>
      ),
    },
  ], [deleteRecord]);

  const handleFinish = (values: any) => {
    const newRecord: TableRecord = {
      id: uuidv4(),
      name: values.name,
      date: values.date.format('YYYY-MM-DD'),
      value: values.value,
    };

    addRecord(newRecord);
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <div className="app-container" style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2>Таблица с данными</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Добавить
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={records}
        rowKey="id"
        pagination={false}
      />

      <Modal
        title="Добавить запись"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            label="Имя"
            name="name"
            rules={[{ required: true, message: 'Пожалуйста, введите имя!' }]}
          >
            <Input placeholder="Иван Иванов" />
          </Form.Item>

          <Form.Item
            label="Дата"
            name="date"
            rules={[{ required: true, message: 'Пожалуйста, выберите дату!' }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            label="Значение"
            name="value"
            rules={[{ required: true, message: 'Пожалуйста, введите число!' }]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="100" />
          </Form.Item>

        </Form>
      </Modal>
    </div>
  );
};

export default App;