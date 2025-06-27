import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Table,
  Modal,
  Form,
} from "react-bootstrap";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import { GET, POST, DELETE, PUT } from "../../../../../api/fetch";
import URL from "../../../../../api/urls";
import { DateTime } from "luxon";

const NationalHoliday = () => {
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({});
  const [data, setData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const DayMonthData = {
    1: {
      name: "January",
      days: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
      ],
    },
    2: {
      name: "February",
      days: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29,
      ],
    },
    3: {
      name: "March",
      days: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
      ],
    },
    4: {
      name: "April",
      days: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
      ],
    },
    5: {
      name: "May",
      days: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
      ],
    },
    6: {
      name: "June",
      days: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
      ],
    },
    7: {
      name: "July",
      days: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
      ],
    },
    8: {
      name: "August",
      days: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
      ],
    },
    9: {
      name: "September",
      days: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
      ],
    },
    10: {
      name: "October",
      days: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
      ],
    },
    11: {
      name: "November",
      days: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
      ],
    },
    12: {
      name: "December",
      days: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
      ],
    },
  };

  const fetchData = async () => {
    console.log(URL.HOLIDAY.NATIONAL);
    const { data, error } = await GET(URL.HOLIDAY.NATIONAL);
    console.log(data)
    if (data) setData(data);
    console.log(error);
  };

  useEffect(() => {
    fetchData();
    setFormData({});
    setFormErrors({});
  }, []);

  const handleOnChange = () => {
    const target = event.target;
    let value = target.value;
    const name = target.name;

    delete formErrors[name];
    setFormErrors({ ...formErrors });

    if (!formData.month) {
      console.log("first");
      setFormData((pre) => {
        return {
          ...pre,
          day: 1,
          month: 1,
        };
      });
    }

    if (name == "month") {
      setFormData((pre) => {
        return {
          ...pre,
          day: 1,
        };
      });
    }

    setFormData((pre) => {
      return {
        ...pre,
        [name]: value,
      };
    });

    console.log(formData);
  };

  const handleFormSubmit = async () => {
    console.log(formData);
    if (formData.name && formData.day && formData.month) {
      
        if(showModal == 'add'){
            const { data, error } = await POST(URL.HOLIDAY.NATIONAL, {
                name: formData.name,
                day: formData.day,
                month: formData.month,
            });
            if (data) {
                setShowModal(null);
                fetchData();
            }
    
            if (error) {
                alert(error);
            }
        }

        if(showModal == 'edit'){
            const { data, error } = await PUT(URL.HOLIDAY.NATIONAL + "/" + selectedId, {
                name: formData.name,
                day: formData.day,
                month: formData.month,
            });
            if (data) {
                setShowModal(null)
                setSelectedId(null)
                fetchData();
            }
    
            if (error) {
                alert(error);
            }
        }
        
    } else {
      if (!formData.name) {
        setFormErrors((pre) => ({
          ...pre,
          name: "Please enter holiday name.",
        }));
      }
      if (!formData.day) {
        setFormErrors((pre) => ({ ...pre, day: "Please select day." }));
      }
      if (!formData.month) {
        setFormErrors((pre) => ({ ...pre, month: "Please select month." }));
      }
    }
  };

  useEffect(() => {
    if(!showModal){
        setFormErrors({});
        setFormData({});
    }
  }, [showModal]);

  const deleteData = async () => {
    const { data, error } = await DELETE(URL.HOLIDAY.NATIONAL + "/" + deleteId);
    if (data) {
      setDeleteId(null);
      fetchData();
    }

    if (error) {
      alert(error);
    }
  };

  useEffect(() => {
    console.log(formData.month)
  }, [formData])

  return (
    <>
      <Container fluid className="pt-2">
        <Row>
          <Col lg={10}>
            <h3 className='pageTitle'>National Holiday</h3>
          </Col>
          <Col lg={2} style={{ textAlign: "right" }}>
            <Button onClick={() => setShowModal('add')}>Add Holiday</Button>
          </Col>
        </Row>

        <Row className="mt-2">
          <Table striped bordered hover>
            <thead>
              <tr style={{ textAlign: "center" }}>
                <th>#</th>
                <th>Holiday Name</th>
                <th>Month</th>
                <th>Day</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 &&
                data.map((item, index) => {
                  return (
                    <tr key={item._id}>
                      <td style={{ textAlign: "center" }}>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{DayMonthData[item.month].name}</td>
                      <td style={{ textAlign: "center" }}>{item.day}</td>
                      <td>
                        <MdDeleteOutline
                          style={{ cursor: "pointer" }}
                          size={25}
                          onClick={() => setDeleteId(item._id)}
                        />
                        <MdEdit
                          size={25}
                          style={{ marginInline: 10, cursor: "pointer" }}
                          onClick={() => {
                              setFormData({
                                  name: item.name,
                                  month: item.month,
                                  day: item.day
                            })
                            setSelectedId(item._id)
                            setShowModal('edit')
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </Row>
      </Container>

      {/* Add Holiday Modal */}
      <Modal
        size="lg"
        centered
        show={showModal == 'add'}
        onHide={() => setShowModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add A New Holiday</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form autoComplete="off" aria-autocomplete="none">
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicText">
                  <Form.Label className={formErrors["name"] && "text-danger"}>
                    Holiday Name
                  </Form.Label>
                  <Form.Control
                    className={formErrors["name"] && "border-danger"}
                    type="text"
                    placeholder="Enter name"
                    name="name"
                    onChange={handleOnChange}
                  />
                  <Form.Text className="text-danger">
                    {formErrors["name"]}
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className="mb-3" controlId="formBasicText">
                  <Form.Label className={formErrors["month"] && "text-danger"}>
                    Month
                  </Form.Label>
                  <Form.Select
                    className={formErrors["month"] && "border-danger"}
                    name="month"
                    onChange={handleOnChange}
                  >
                    {Object.keys(DayMonthData).map((key) => {
                      return (
                        <option key={key} value={key}>
                          {DayMonthData[key].name}
                        </option>
                      );
                    })}
                  </Form.Select>
                  <Form.Text className="text-danger">
                    {formErrors["month"]}
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className="mb-3" controlId="formBasicText">
                  <Form.Label className={formErrors["day"] && "text-danger"}>
                    Day
                  </Form.Label>
                  <Form.Select
                    className={formErrors["day"] && "border-danger"}
                    name="day"
                    onChange={handleOnChange}
                  >
                    {DayMonthData[formData.month || 1].days.map((day) => {
                      return (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      );
                    })}
                  </Form.Select>
                  <Form.Text className="text-danger">
                    {formErrors["day"]}
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" onClick={handleFormSubmit}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Update Holiday Modal */}
      <Modal
        size="lg"
        centered
        show={showModal == 'edit'}
        onHide={() => setShowModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Holiday</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form autoComplete="off" aria-autocomplete="none">
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicText">
                  <Form.Label className={formErrors["name"] && "text-danger"}>
                    Holiday Name
                  </Form.Label>
                  <Form.Control
                    className={formErrors["name"] && "border-danger"}
                    type="text"
                    placeholder="Enter name"
                    name="name"
                    value={formData.name}
                    onChange={handleOnChange}
                  />
                  <Form.Text className="text-danger">
                    {formErrors["name"]}
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className="mb-3" controlId="formBasicText">
                  <Form.Label className={formErrors["month"] && "text-danger"}>
                    Month
                  </Form.Label>
                  <Form.Select
                    className={formErrors["month"] && "border-danger"}
                    name="month"
                    onChange={handleOnChange}
                  >
                    {Object.keys(DayMonthData).map((key) => {
                      return (
                        <option selected={formData.month == key} key={key} value={key}>
                          {DayMonthData[key].name}
                        </option>
                      );
                    })}
                  </Form.Select>
                  <Form.Text className="text-danger">
                    {formErrors["month"]}
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col>
                <Form.Group className="mb-3" controlId="formBasicText">
                  <Form.Label className={formErrors["day"] && "text-danger"}>
                    Day
                  </Form.Label>
                  <Form.Select
                    className={formErrors["day"] && "border-danger"}
                    name="day"
                    onChange={handleOnChange}
                  >
                    {DayMonthData[formData.month || 1].days.map((day) => {
                      return (
                        <option selected={formData.day == day} key={day} value={day}>
                          {day}
                        </option>
                      );
                    })}
                  </Form.Select>
                  <Form.Text className="text-danger">
                    {formErrors["day"]}
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" onClick={handleFormSubmit}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal centered show={deleteId != null} onHide={() => setDeleteId(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete National Holiday</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this National Holiday ?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" onClick={deleteData}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NationalHoliday;
