import React, { useState, useMemo } from 'react';
import { Table, Button, Space, Modal, Form, Input, DatePicker, InputNumber } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { useTableStore } from './store/useTableStore';
import type { TableRecord } from './store/useTableStore';
import dayjs from 'dayjs';

const App: React.FC = () => {
  const records = useTableStore((state) => state.records);
  const deleteRecord = useTableStore((state) => state.deleteRecord);
  const addRecord = useTableStore((state) => state.addRecord);
  const updateRecord = useTableStore((state) => state.updateRecord);

  const searchQuery = useTableStore((state) => state.searchQuery);
  const setSearchQuery = useTableStore((state) => state.setSearchQuery);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editRecordId, setEditRecordId] = useState<string | null>(null);

  const [form] = Form.useForm();

  const columns: ColumnsType<TableRecord> = useMemo(() => [
    {
      title: 'Имя',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Дата',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => a.date.localeCompare(b.date),
    },
    {
      title: 'Значение',
      dataIndex: 'value',
      key: 'value',
      sorter: (a, b) => a.value - b.value,
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditClick(record)}
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

  const filteredRecords = useMemo(() => {
    if (!searchQuery) return records;

    const lowerCaseQuery = searchQuery.toLowerCase();

    return records.filter((record) => {
      const matchName = record.name.toLowerCase().includes(lowerCaseQuery);
      const matchDate = record.date.includes(lowerCaseQuery);
      const matchValue = record.value.toString().includes(lowerCaseQuery);

      return matchName || matchDate || matchValue;
    });
  }, [records, searchQuery]);

  const handleFinish = (values: any) => {
    const formattedDate = values.date.format('YYYY-MM-DD');

    if (editRecordId) {
      updateRecord({
        id: editRecordId,
        name: values.name,
        date: formattedDate,
        value: values.value,
      });
    } else {
      const newRecord: TableRecord = {
        id: uuidv4(),
        name: values.name,
        date: formattedDate,
        value: values.value,
      };
      addRecord(newRecord);
    }

    closeModal();
  };

  const handleEditClick = (record: TableRecord) => {
    setEditRecordId(record.id);
    form.setFieldsValue({
      name: record.name,
      date: dayjs(record.date),
      value: record.value,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditRecordId(null);
    form.resetFields();
  };

  return (
    <div className="app-container" style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2>Таблица с данными</h2>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Input
            placeholder="Поиск"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
            style={{ width: 300 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            Добавить
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredRecords}
        rowKey={"id"}
        pagination={false}
      />

      <Modal
        title={editRecordId ? "Редактировать запись" : "Добавить запись"}
        open={isModalOpen}
        onCancel={closeModal}
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
    </div >
  );
};

export default App;