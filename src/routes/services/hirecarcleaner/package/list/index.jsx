import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Table,
  Modal,
  Form,
  InputGroup,
} from "react-bootstrap";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import { GET, POST, DELETE, PUT } from "../../../../../api/fetch";
import URL from "../../../../../api/urls";
import { LuMinusCircle, LuPlusCircle } from "react-icons/lu";
import { PiCurrencyInr } from "react-icons/pi";

const PackageList = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});
  const [editData, setEditData] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [carCategories, setCarCategories] = useState([]);
  const [taxInputCount, setTaxInputCount] = useState([]);
  const [totalTaxValue, setTotalTaxValue] = useState(0);
  const [demoPackageExist, setDemoPackageExist] = useState(false)
  const [formErrors, setFormErrors] = useState({})

  const fetchData = async () => {
    const packages = await GET(URL.PACKAGE);
    if (packages.data) {
      const demoPackageFound = packages.data.filter(package_ => package_.package_type == "DEMO")
      if(demoPackageFound && demoPackageFound.length > 0){
        setDemoPackageExist(true)
      } else {
        setDemoPackageExist(false)
      }
      setData(packages.data);
      console.log(packages.data)
    }

    const carCategoriesData = await GET(URL.CAR.CATEGORY);
    if (carCategoriesData.data.length) setCarCategories(carCategoriesData.data);
  };

  const handleOnChange = async (event) => {
    const target = event.target;
    let value = target.value;
    const name = target.name;
    delete formErrors[name]
    setFormErrors({...formErrors})

    if (editData && showEditModal) {
      if (name.includes("tax_")) {
        const number = name.split("_")[2];

        let tax_data;
        if (name.includes("tax_name")) {
          tax_data = {
            [number]: {
              name: value,
            },
          };
        }
        if (name.includes("tax_value")) {
          tax_data = {
            [number]: {
              value: value,
            },
          };
        }

        const earlier_tax_data = editData.taxes && editData.taxes[number];
        if (earlier_tax_data) {
          setEditData({
            ...editData,
            taxes: {
              ...editData.taxes,
              [number]: {
                ...earlier_tax_data,
                ...tax_data[number],
              },
            },
          });
        } else {
          setEditData({
            ...editData,
            taxes: {
              ...editData.taxes,
              ...tax_data,
            },
          });
        }
      } else if (name.includes("=")) {
        const category = name.split("=")[0];
        const name_ = name.split("=")[1];
        console.log(category, name_)
        console.log(editData.prices)
        const earlier_data =
          editData &&
          editData.prices &&
          editData.prices.filter((item) => item.category == category);
        let price_data;
        console.log(earlier_data)
        if (earlier_data && earlier_data.length) {
          price_data = {
            ...earlier_data[0],
            [name_]: value,
            category: category,
          };
          const new_prices_data = editData.prices.filter(
            (item) => item.category != category
          );
          setEditData({
            ...editData,
            prices: [...new_prices_data, price_data],
          });
        } else {
          console.log("first")
          price_data = {
            category: category,
            [name_]: value,
          };
          setEditData({
            ...editData,
            prices: [...editData.prices, price_data],
          });
          console.log(editData)
        }
      } else if (name == "visible") {
        const value = target.checked;
        setEditData({
          ...editData,
          [name]: value,
        });
      } else {
        setEditData({
          ...editData,
          [name]: value,
        });
        console.log(name, value)
      }
    } else {
      if (name.includes("=")) {
        const category = name.split("=")[0];
        const name_ = name.split("=")[1];
        const earlier_data =
          formData &&
          formData.prices &&
          formData.prices.filter((item) => item.category == category);
        let price_data;
        if (earlier_data) {
          price_data = {
            ...earlier_data[0],
            [name_]: value,
            category: category,
          };
          const new_prices_data = formData.prices.filter(
            (item) => item.category != category
          );
          setFormData({
            ...formData,
            prices: [...new_prices_data, price_data],
          });
        } else {
          price_data = {
            category: category,
            [name_]: value,
          };
          setFormData({
            ...formData,
            prices: [price_data],
          });
        }
      } else if (name.includes("tax_")) {
        const number = name.split("_")[2];

        let tax_data;
        if (name.includes("tax_name")) {
          tax_data = {
            [number]: {
              name: value,
            },
          };
        }
        if (name.includes("tax_value")) {
          tax_data = {
            [number]: {
              value: value,
            },
          };
        }
        const earlier_tax_data = formData.taxes && formData.taxes[number];
        if (earlier_tax_data) {
          setFormData({
            ...formData,
            taxes: {
              ...formData.taxes,
              [number]: {
                ...earlier_tax_data,
                ...tax_data[number],
              },
            },
          });
        } else {
          setFormData({
            ...formData,
            taxes: {
              ...formData.taxes,
              ...tax_data,
            },
          });
        }
      } else if (name == "visible" || name == "package_type") {
        const value = target.checked;
        setFormData({
          ...formData,
          [name]: value,
        });
      } else {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    }
  };

  const deleteData = async () => {
    const { data, error } = await DELETE(`${URL.PACKAGE}/${deleteId}`);
    if (data) {
      setDeleteId(null);
      fetchData();
    }

    if (error) alert(error);
  };

  const handleFormSubmit = async () => {
    if (editData && showEditModal) {
      if (
        editData.name &&
        editData.number_of_days &&
        !isNaN(parseInt(editData.number_of_days)) &&
        editData.number_of_days > 0 &&
        editData.exterior_cleaning &&
        !isNaN(parseInt(editData.exterior_cleaning)) &&
        editData.exterior_cleaning >= 0 &&
        editData.interior_cleaning &&
        !isNaN(parseInt(editData.interior_cleaning)) &&
        editData.interior_cleaning >= 0 &&
        (parseInt(editData.number_of_days) > parseInt(editData.interior_cleaning) + parseInt(editData.exterior_cleaning)) &&
        (editData._2nd_car_onward_off && !isNaN(editData._2nd_car_onward_off)) &&
        (parseInt(editData._2nd_car_onward_off) <= 25)
      ) {
        delete editData._id;
        let taxesArray = [];
        if (editData.taxes && Object.keys(editData.taxes).length > 0) {
          taxesArray = Object.keys(editData.taxes).map(
            (number) => editData.taxes[number]
          );
        }

        const dataToSend = {
          ...editData,
          taxes: [...taxesArray],
          visible: editData.visible || false,
          _2nd_car_onward_off: parseInt(editData._2nd_car_onward_off) || 0
        };
        delete dataToSend['created_at']
        delete dataToSend['updated_at']
        delete dataToSend['__v']
        console.log(dataToSend)
        const { data, error } = await PUT(URL.PACKAGE + "/" + editId, {
          ...dataToSend,
        })
        if (data) {
          setShowEditModal(false)
          setEditData({})
          setEditId(null)
          fetchData();
        }

        if (error) {
          alert(error)
        }
      } else {
        if(!editData.name){
          setFormErrors(pre => ({...pre, name: "Please enter package name."}))
        }
        if(!editData.number_of_days){
          setFormErrors(pre => ({...pre, number_of_days: "Please enter number of days."}))
        } else if(isNaN(parseInt(editData.number_of_days)) || parseInt(editData.number_of_days) <= 0){
          setFormErrors(pre => ({...pre, number_of_days: "Please enter valid number of days."}))
        }
        if(!editData.exterior_cleaning){
          setFormErrors(pre => ({...pre, exterior_cleaning: "Please enter number of exterior cleanings."}))
        } else if(isNaN(parseInt(editData.exterior_cleaning)) || parseInt(editData.exterior_cleaning) < 0){
          setFormErrors(pre => ({...pre, exterior_cleaning: "Please enter valid number of exterior cleanings."}))
        }
        if(!editData.interior_cleaning){
          setFormErrors(pre => ({...pre, interior_cleaning: "Please enter number of interior cleanings."}))
        } else if(isNaN(parseInt(editData.interior_cleaning)) || parseInt(editData.interior_cleaning) < 0){
          setFormErrors(pre => ({...pre, interior_cleaning: "Please enter valid number of interior cleanings."}))
        }
        if(parseInt(editData.number_of_days) <= parseInt(editData.exterior_cleaning) + parseInt(editData.interior_cleaning)){
          setFormErrors(pre => ({...pre, number_of_days: "Number of days should be greater than sum of cleanings."}))
        }
        if(editData._2nd_car_onward_off && isNaN(editData._2nd_car_onward_off)){
          setFormErrors(pre => ({...pre, _2nd_car_onward_off: "This value should be numeric only."}))
        }
        if(editData._2nd_car_onward_off && parseInt(editData._2nd_car_onward_off) > 25){
          setFormErrors(pre => ({...pre, _2nd_car_onward_off: "This value should be less than or equal to 25."}))
        }
      }
    } else {
      console.log(formData)
      if (
        formData.name &&
        formData.number_of_days &&
        !isNaN(parseInt(formData.number_of_days)) &&
        formData.number_of_days > 0 &&
        formData.exterior_cleaning &&
        !isNaN(parseInt(formData.exterior_cleaning)) &&
        formData.exterior_cleaning >= 0 &&
        formData.interior_cleaning &&
        !isNaN(parseInt(formData.interior_cleaning)) &&
        formData.interior_cleaning >= 0 &&
        parseInt(formData.number_of_days) > parseInt(formData.interior_cleaning) + parseInt(formData.exterior_cleaning) &&
        (formData._2nd_car_onward_off && !isNaN(formData._2nd_car_onward_off && (parseInt(formData._2nd_car_onward_off) <= 25)))
      ) {
        let taxesArray = [];
        if (formData.taxes && Object.keys(formData.taxes).length > 0) {
          taxesArray = Object.keys(formData.taxes).map(
            (number) => formData.taxes[number]
          );
        }

        const dataToSend = {
          ...formData,
          taxes: [...taxesArray],
          visible: formData.visible || false,
          package_type: formData.package_type == true ? "DEMO" : "REGULAR",
          _2nd_car_onward_off: parseInt(formData._2nd_car_onward_off) || 0 
        };

        console.log(dataToSend)

        const { data, error } = await POST(URL.PACKAGE, dataToSend);
        if (data) {
          setShowModal(false);
          fetchData();
        }

        if (error) {
          alert(error);
        }
      } else {
        if(!formData.name){
          setFormErrors(pre => ({...pre, name: "Please enter package name."}))
        }
        if(!formData.number_of_days){
          setFormErrors(pre => ({...pre, number_of_days: "Please enter number of days."}))
        } else if(isNaN(parseInt(formData.number_of_days)) || parseInt(formData.number_of_days) <= 0){
          setFormErrors(pre => ({...pre, number_of_days: "Please enter valid number of days."}))
        }
        if(!formData.exterior_cleaning){
          setFormErrors(pre => ({...pre, exterior_cleaning: "Please enter number of exterior cleanings."}))
        } else if(isNaN(parseInt(formData.exterior_cleaning)) || parseInt(formData.exterior_cleaning) < 0){
          setFormErrors(pre => ({...pre, exterior_cleaning: "Please enter valid number of exterior cleanings."}))
        }
        if(!formData.interior_cleaning){
          setFormErrors(pre => ({...pre, interior_cleaning: "Please enter number of interior cleanings."}))
        } else if(isNaN(parseInt(formData.interior_cleaning)) || parseInt(formData.interior_cleaning) < 0){
          setFormErrors(pre => ({...pre, interior_cleaning: "Please enter valid number of interior cleanings."}))
        }
        if(parseInt(formData.number_of_days) <= parseInt(formData.exterior_cleaning) + parseInt(formData.interior_cleaning)){
          setFormErrors(pre => ({...pre, number_of_days: "Number of days should be greater than sum of cleanings."}))
        }
        if(formData._2nd_car_onward_off && isNaN(formData._2nd_car_onward_off)){
          setFormErrors(pre => ({...pre, _2nd_car_onward_off: "This value should be numeric only."}))
        }
        if(formData._2nd_car_onward_off && parseInt(formData._2nd_car_onward_off) > 25){
          setFormErrors(pre => ({...pre, _2nd_car_onward_off: "This value should be less than or equal to 25."}))
        }
      }
    }
  };

  useEffect(() => {
    fetchData();
    setFormErrors({})
    setFormData({})
  }, []);

  useEffect(() => {
    if(!showEditModal) {
      setEditData({})
      setFormErrors({})
    }
    if(!showModal) {
      setFormData({})
      setFormErrors({})
    }
  }, [showEditModal, showModal])

  useEffect(() => {
    if (formData.taxes && Object.keys(formData.taxes).length > 0) {
      let taxValue = 0;
      Object.keys(formData.taxes).forEach((index) => {
        if (formData.taxes[index].value) {
          taxValue += parseInt(formData.taxes[index].value);
        }
      });
      setTotalTaxValue(taxValue);
    }
  }, [formData.taxes]);

  useEffect(() => {
    if (editData.taxes && Object.keys(editData.taxes).length > 0) {
      let taxValue = 0;
      Object.keys(editData.taxes).forEach((index) => {
        if (editData.taxes[index].value) {
          taxValue += parseInt(editData.taxes[index].value);
        }
      });
      setTotalTaxValue(taxValue);
    }
  }, [editData.taxes]);

  useEffect(() => {
    console.log(editData)
  }, [editData])

  useEffect(() => {
    setFormErrors({})
    setTotalTaxValue(0)
    setTaxInputCount([])
  }, [showModal])

  return (
    <>
      <Container fluid className="pt-2">
        <Row>
          <Col md={9}>
            <h3 className='pageTitle'>Package</h3>
          </Col>
          <Col md={3} style={{ textAlign: "right" }}>
            <Button onClick={() => setShowModal(true)}>Add Package</Button>
          </Col>
        </Row>

        <Row className="mt-2">
          <h5>Demo Package</h5>
          <Table striped bordered hover className="mt-1">
            <thead>
              <tr style={{ textAlign: 'center' }}>
                <th>#</th>
                <th>Package ID</th>
                <th>Name</th>
                <th>Days</th>
                <th>Int. Cleaning</th>
                <th>Ext. Cleaning</th>
                <th>Visible</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
                {
                  data && data.map((item, index) => {
                    return(
                      item.package_type == "DEMO" && 
                      <tr key={item._id}>
                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                    <td>{item.package_id}</td>
                    <td>{item.name}</td>
                    <td style={{ textAlign: 'center' }}>{item.number_of_days}</td>
                    <td style={{ textAlign: 'center' }}>{item.interior_cleaning}</td>
                    <td style={{ textAlign: 'center' }}>{item.exterior_cleaning}</td>
                    <td>{item.visible ? "Yes" : "No"}</td>
                    <td>
                      <MdDeleteOutline
                        style={{ cursor: 'pointer' }}
                        size={25}
                      />
                      <MdEdit
                        size={25}
                        style={{ marginInline: 10, cursor: 'pointer' }}
                        
                      />
                    </td>
                  </tr>
                    )
                  })
                }
            </tbody>
          </Table>  
        </Row>

        <Row className="mt-2">
          <h5>Regular Packages</h5>
          <Table striped bordered hover className="mt-1">
            <thead>
              <tr style={{ textAlign: 'center' }}>
                <th>#</th>
                <th>Package ID</th>
                <th>Name</th>
                <th>Days</th>
                <th>Int. Cleaning</th>
                <th>Ext. Cleaning</th>
                <th>Renew Alert Threshold</th>
                <th>Visible</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => {
                return (
                  item.package_type != "DEMO" &&
                  <tr key={item._id}>
                    <td style={{ textAlign: 'center' }}>{ demoPackageExist ? index : index + 1}</td>
                    <td>{item.package_id}</td>
                    <td>{item.name}</td>
                    <td style={{ textAlign: 'center' }}>{item.number_of_days}</td>
                    <td style={{ textAlign: 'center' }}>{item.interior_cleaning}</td>
                    <td style={{ textAlign: 'center' }}>{item.exterior_cleaning}</td>
                    <td>{"-"}</td>
                    <td>{item.visible ? "Yes" : "No"}</td>
                    <td>
                      <MdDeleteOutline
                        onClick={() => setDeleteId(item._id)}
                        size={25}
                        style={{ cursor: 'pointer' }}
                      />
                      <MdEdit
                        size={25}
                        style={{ marginInline: 10, cursor: 'pointer' }}
                        onClick={() => {
                          setTaxInputCount([]);
                          let taxesData = {};
                          item.taxes.forEach((taxData, index) => {
                            taxesData = {
                              ...taxesData,
                              [index]: {
                                name: taxData.name,
                                value: taxData.value,
                              },
                            };
                            if (index == 0) {
                              setTaxInputCount([0]);
                            } else {
                              setTaxInputCount((pre) => [...pre, pre.length]);
                            }
                          });
                          setEditData({
                            ...item,
                            taxes: { ...taxesData },
                          });
                          setShowEditModal(true);
                          setEditId(item._id);
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

      {/* Add Package Modal */}
      <Modal
        size="xl"
        centered
        show={showModal}
        onHide={() => setShowModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add A New Package</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form autoComplete='off' aria-autocomplete='none'>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicText">
                  <Form.Label className={ formErrors["name"] && 'text-danger'}>Package Name</Form.Label>
                  <Form.Control
                    className={ formErrors["name"] && 'border-danger'}
                    type="text"
                    placeholder="Enter name"
                    name="name"
                    onChange={handleOnChange}
                  />
                  <Form.Text className="text-danger">
                    { formErrors["name"] }
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col></Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicText">
                  <Form.Label className={ formErrors["number_of_days"] && 'text-danger'}>Days</Form.Label>
                  <Form.Control
                    className={ formErrors["number_of_days"] && 'border-danger'}
                    type="number"
                    placeholder="Enter days"
                    name="number_of_days"
                    onChange={handleOnChange}
                  />
                  <Form.Text className="text-danger">
                    { formErrors["number_of_days"] }
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicText">
                  <Form.Label className={ formErrors["exterior_cleaning"] && 'text-danger'}>Exterior Cleanings</Form.Label>
                  <Form.Control
                    className={ formErrors["exterior_cleaning"] && 'border-danger'}
                    type="number"
                    placeholder="Enter number"
                    name="exterior_cleaning"
                    onChange={handleOnChange}
                  />
                  <Form.Text className="text-danger">
                    { formErrors["exterior_cleaning"] }
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicText">
                  <Form.Label className={ formErrors["interior_cleaning"] && 'text-danger'}>Interior Cleanings</Form.Label>
                  <Form.Control
                    className={ formErrors["interior_cleaning"] && 'border-danger'}
                    type="number"
                    placeholder="Enter number"
                    name="interior_cleaning"
                    onChange={handleOnChange}
                  />
                  <Form.Text className="text-danger">
                    { formErrors["interior_cleaning"] }
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicText">
                  <Form.Label className={ formErrors["_2nd_car_onward_off"] && 'text-danger'}>2nd Car onward off (%)</Form.Label>
                  <Form.Control
                    className={ formErrors["_2nd_car_onward_off"] && 'border-danger'}
                    type="number"
                    placeholder="Enter value"
                    name="_2nd_car_onward_off"
                    onChange={handleOnChange}
                  />
                  <Form.Text className="text-danger">
                    { formErrors["_2nd_car_onward_off"] }
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            {taxInputCount.map((number, index) => {
              return (
                <>
                  <Row key={number}>
                    <Col>
                      <Form.Group className="mb-3" controlId="formBasicText">
                        <Form.Label>Tax Name</Form.Label>
                        <Form.Control
                          type="string"
                          placeholder="Enter tax name"
                          name={"tax_name_" + number}
                          onChange={handleOnChange}
                        />
                        <Form.Text className="text-muted">E.g. GST</Form.Text>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Label>Tax Value ( % )</Form.Label>
                      <InputGroup className="mb-3" controlId="formBasicText">
                        <Form.Control
                          type="number"
                          placeholder="Enter tax value"
                          name={"tax_value_" + number}
                          onChange={handleOnChange}
                        />
                        <InputGroup.Text>%</InputGroup.Text>
                        <Form.Text className="text-muted">
                          Enter Number without % symbol.
                        </Form.Text>
                      </InputGroup>
                    </Col>
                    <Col
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      {
                        <LuMinusCircle
                          onClick={() => {
                            const d = taxInputCount;
                            d.length = d.length - 1;
                            if (d.length == 0) {
                              setTaxInputCount([]);
                            } else {
                              setTaxInputCount([...d]);
                            }
                            const taxes = formData.taxes;
                            if (taxes) {
                              delete taxes[number];
                              setFormData({
                                ...formData,
                                taxes: {
                                  ...taxes,
                                },
                              });
                            }
                          }}
                          size={25}
                          style={{ marginBottom: 7, cursor: "pointer" }}
                        />
                      }
                    </Col>
                    <Col></Col>
                  </Row>
                </>
              );
            })}

            <Row>
              <Col>
                <Row>
                  <Col
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    <LuPlusCircle size={20} />
                    <Button
                      style={{
                        backgroundColor: "rgba(0,0,0,0)",
                        border: "none",
                        color: "black",
                      }}
                      onClick={() => {
                        setTaxInputCount([
                          ...taxInputCount,
                          taxInputCount.length,
                        ]);
                      }}
                    >
                      Add Tax
                    </Button>
                  </Col>
                </Row>
              </Col>
              <Col></Col>
              <Col></Col>
            </Row>

            {carCategories.length > 0 && (
              <>
                <hr></hr>
                <h5>Car Categories and their price</h5>
              </>
            )}

            {carCategories.map((item, index) => {
              return (
                <>
                  <Row key={index} className="mt-2">
                    <Col>
                      <Form.Group className="mb-3" controlId="formBasicText">
                        <Form.Label>Category Name</Form.Label>
                        <Form.Control
                          disabled={true}
                          type="text"
                          value={item.name}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Label>Strikethrough Price</Form.Label>
                      <InputGroup className="mb-3" controlId="formBasicText">
                        <InputGroup.Text>
                          <PiCurrencyInr />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          name={item._id + "=strikethrough_price"}
                          onChange={handleOnChange}
                        />
                      </InputGroup>
                    </Col>
                    <Col>
                      <Form.Label>Actual Price</Form.Label>
                      <InputGroup className="mb-3" controlId="formBasicText">
                        <InputGroup.Text>
                          <PiCurrencyInr />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          name={item._id + "=actual_price"}
                          onChange={handleOnChange}
                        />
                      </InputGroup>
                    </Col>
                    <Col>
                      <Form.Label>Total Price</Form.Label>
                      <InputGroup className="mb-3" controlId="formBasicText">
                        <InputGroup.Text>
                          <PiCurrencyInr />
                        </InputGroup.Text>
                        <Form.Control
                          readOnly
                          disabled
                          type="text"
                          name={item._id + "=total_price"}
                          value={
                            formData &&
                            formData.prices &&
                            formData.prices.length > 0
                              ? (() => {
                                  const d = formData.prices.filter(
                                    (item_) => item_.category == item._id
                                  );
                                  return (
                                    d.length &&
                                    parseInt(d[0].actual_price) +
                                      parseInt(d[0].actual_price) *
                                        (parseInt(totalTaxValue) / 100)
                                  );
                                })()
                              : "-"
                          }
                          onChange={handleOnChange}
                        />
                      </InputGroup>
                    </Col>
                    <Col>
                      <Form.Label>Int. Refund Price</Form.Label>
                      <InputGroup className="mb-3" controlId="formBasicText">
                        <InputGroup.Text>
                          <PiCurrencyInr />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          name={item._id + "=int_refund_price"}
                          onChange={handleOnChange}
                        />
                        <Form.Text className="text-danger">
                          { formErrors[item._id + "=int_refund_price"] }
                        </Form.Text>
                      </InputGroup>
                    </Col>
                    <Col>
                      <Form.Label>Ext. Refund Price</Form.Label>
                      <InputGroup className="mb-3" controlId="formBasicText">
                        <InputGroup.Text>
                          <PiCurrencyInr />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          name={item._id + "=ext_refund_price"}
                          onChange={handleOnChange}
                        />
                        <Form.Text className="text-danger">
                          { formErrors[item._id + "=ext_refund_price"] }
                        </Form.Text>
                      </InputGroup>
                    </Col>
                  </Row>
                </>
              );
            })}

            <Row className="mt-2">
              <Col>
                <Form.Check
                  name="visible"
                  type="switch"
                  id="custom-switch"
                  label="Visible"
                  defaultChecked={false}
                  onClick={handleOnChange}
                />
              </Col>
              {
                data && data.filter(package_ => package_.package_type == "DEMO").length == 0 && <Col>
                  <Form.Check
                    name="package_type"
                    type="switch"
                    id="custom-switch"
                    label="Demo Package"
                    defaultChecked={false}
                    onClick={handleOnChange}
                  />
                </Col>
              }
              <Col></Col>
              <Col></Col>
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

      {/* Update Package Modal */}
      <Modal
        size="xl"
        centered
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Package</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form autoComplete='off' aria-autocomplete='none'>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicText">
                  <Form.Label className={ formErrors["name"] && 'text-danger'}>Package Name</Form.Label>
                  <Form.Control
                    className={ formErrors["name"] && 'border-danger'}
                    type="text"
                    placeholder="Enter name"
                    value={editData.name}
                    name="name"
                    onChange={handleOnChange}
                  />
                  <Form.Text className="text-danger">
                    { formErrors["name"] }
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col></Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicText">
                  <Form.Label className={ formErrors["number_of_days"] && 'text-danger'}>Days</Form.Label>
                  <Form.Control
                    className={ formErrors["number_of_days"] && 'border-danger'}
                    type="number"
                    placeholder="Enter number of days"
                    name="number_of_days"
                    value={editData.number_of_days}
                    onChange={handleOnChange}
                  />
                  <Form.Text className="text-danger">
                    { formErrors["number_of_days"] }
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicText">
                  <Form.Label className={ formErrors["exterior_cleaning"] && 'text-danger'}>Exterior Cleanings</Form.Label>
                  <Form.Control
                    className={ formErrors["exterior_cleaning"] && 'border-danger'}
                    type="number"
                    placeholder="Enter number"
                    name="exterior_cleaning"
                    value={editData.exterior_cleaning}
                    onChange={handleOnChange}
                  />
                  <Form.Text className="text-danger">
                    { formErrors["exterior_cleaning"] }
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicText">
                  <Form.Label className={ formErrors["interior_cleaning"] && 'text-danger'}>Interior Cleanings</Form.Label>
                  <Form.Control
                    className={ formErrors["interior_cleaning"] && 'border-danger'}
                    type="number"
                    placeholder="Enter number"
                    name="interior_cleaning"
                    value={editData.interior_cleaning}
                    onChange={handleOnChange}
                  />
                  <Form.Text className="text-danger">
                    { formErrors["interior_cleaning"] }
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicText">
                  <Form.Label className={ formErrors["_2nd_car_onward_off"] && 'text-danger'}>2nd Car onward off (%)</Form.Label>
                  <Form.Control
                    className={ formErrors["_2nd_car_onward_off"] && 'border-danger'}
                    type="text"
                    placeholder="Enter value"
                    value={editData._2nd_car_onward_off}
                    name="_2nd_car_onward_off"
                    onChange={handleOnChange}
                  />
                  <Form.Text className="text-danger">
                    { formErrors["_2nd_car_onward_off"] }
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            {taxInputCount.map((number, index) => {
              return (
                <>
                  <Row key={index}>
                    <Col>
                      <Form.Group className="mb-3" controlId="formBasicText">
                        <Form.Label>Tax Name</Form.Label>
                        <Form.Control
                          type="string"
                          placeholder="Enter tax name"
                          name={"tax_name_" + number}
                          value={
                            (editData.taxes &&
                              editData.taxes[number] &&
                              editData.taxes[number].name) ||
                            ""
                          }
                          onChange={handleOnChange}
                        />
                        <Form.Text className="text-muted">E.g. GST</Form.Text>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Label>Tax Value ( % )</Form.Label>
                      <InputGroup className="mb-3" controlId="formBasicText">
                        <Form.Control
                          type="number"
                          placeholder="Enter tax value"
                          name={"tax_value_" + number}
                          value={
                            (editData.taxes &&
                              editData.taxes[number] &&
                              editData.taxes[number].value) ||
                            ""
                          }
                          onChange={handleOnChange}
                        />
                        <InputGroup.Text>%</InputGroup.Text>
                        <Form.Text className="text-muted">
                          Enter Number without % symbol.
                        </Form.Text>
                      </InputGroup>
                    </Col>
                    <Col
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      {
                        <LuMinusCircle
                          onClick={() => {
                            const d = taxInputCount;
                            d.length = d.length - 1;
                            if (d.length == 0) {
                              setTaxInputCount([]);
                            } else {
                              setTaxInputCount([...d]);
                            }
                            const taxes = editData.taxes;
                            if (taxes) {
                              delete taxes[number];
                              setEditData({
                                ...editData,
                                taxes: {
                                  ...taxes,
                                },
                              });
                            }
                          }}
                          size={25}
                          style={{ marginBottom: 7, cursor: "pointer" }}
                        />
                      }
                    </Col>
                  </Row>
                </>
              );
            })}

            <Row>
              <Col>
                <Row>
                  <Col
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    <LuPlusCircle size={20} />
                    <Button
                      style={{
                        backgroundColor: "rgba(0,0,0,0)",
                        border: "none",
                        color: "black",
                      }}
                      onClick={() => {
                        setTaxInputCount([
                          ...taxInputCount,
                          taxInputCount.length,
                        ]);
                      }}
                    >
                      Add Tax
                    </Button>
                  </Col>
                </Row>
              </Col>
              <Col></Col>
              <Col></Col>
            </Row>

            {carCategories.length > 0 && (
              <>
                <hr></hr>
                <h5>Car Categories and their price</h5>
              </>
            )}

            {editData &&
              editData.prices &&
              editData.prices.map((item, index) => {
                const categoryData = carCategories.find(
                  (item_) => item_._id == item.category
                );
                return (
                  categoryData && <>
                    <Row className="mt-2">
                      <Col>
                        <Form.Group className="mb-3" controlId="formBasicText">
                          <Form.Label>Category Name</Form.Label>
                          <Form.Control
                            disabled={true}
                            type="text"
                            value={categoryData.name}
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Label>Strikethrough Price</Form.Label>
                        <InputGroup className="mb-3" controlId="formBasicText">
                          <InputGroup.Text>
                            <PiCurrencyInr />
                          </InputGroup.Text>
                          <Form.Control
                            type="text"
                            name={item.category + "=strikethrough_price"}
                            value={item.strikethrough_price}
                            onChange={handleOnChange}
                          />
                        </InputGroup>
                      </Col>
                      <Col>
                        <Form.Label>Actual Price</Form.Label>
                        <InputGroup className="mb-3" controlId="formBasicText">
                          <InputGroup.Text>
                            <PiCurrencyInr />
                          </InputGroup.Text>
                          <Form.Control
                            type="text"
                            name={item.category + "=actual_price"}
                            value={item.actual_price}
                            onChange={handleOnChange}
                          />
                        </InputGroup>
                      </Col>
                      <Col>
                        <Form.Label>Total Price</Form.Label>
                        <InputGroup className="mb-3" controlId="formBasicText">
                          <InputGroup.Text>
                            <PiCurrencyInr />
                          </InputGroup.Text>
                          <Form.Control
                            type="text"
                            disabled
                            readOnly
                            name={item.category + "=actual_price"}
                            value={
                              editData &&
                              editData.prices &&
                              editData.prices.length > 0
                                ? (() => {
                                    const d = editData.prices.filter(
                                      (item_) =>
                                        item_.category == categoryData._id
                                    );
                                    return (
                                      d.length &&
                                      parseInt(d[0].actual_price) +
                                        parseInt(d[0].actual_price) *
                                          (parseInt(totalTaxValue) / 100)
                                    );
                                  })()
                                : "-"
                            }
                            // onChange={handleOnChange}
                          />
                        </InputGroup>
                      </Col>
                      <Col>
                        <Form.Label>Int. Refund Price</Form.Label>
                        <InputGroup className="mb-3" controlId="formBasicText">
                          <InputGroup.Text>
                            <PiCurrencyInr />
                          </InputGroup.Text>
                          <Form.Control
                            type="text"
                            name={item.category + "=int_refund_price"}
                            onChange={handleOnChange}
                            value={
                              editData &&
                              editData.prices &&
                              editData.prices.length &&
                                (() => {
                                  const d = editData.prices.filter(
                                    (item_) =>
                                      item_.category == categoryData._id
                                  );
                                  return (
                                    d.length && d[0].int_refund_price
                                  )
                                })()
                            }
                          />
                          <Form.Text className="text-danger">
                            { formErrors[item._id + "=int_refund_price"] }
                          </Form.Text>
                        </InputGroup>
                      </Col>
                      <Col>
                        <Form.Label>Ext. Refund Price</Form.Label>
                        <InputGroup className="mb-3" controlId="formBasicText">
                          <InputGroup.Text>
                            <PiCurrencyInr />
                          </InputGroup.Text>
                          <Form.Control
                            type="text"
                            name={item.category + "=ext_refund_price"}
                            onChange={handleOnChange}
                            value={
                              editData &&
                              editData.prices &&
                              editData.prices.length &&
                                (() => {
                                  const d = editData.prices.filter(
                                    (item_) =>
                                      item_.category == categoryData._id
                                  );
                                  return (
                                    d.length && d[0].ext_refund_price
                                  );
                                })()
                            }
                          />
                          <Form.Text className="text-danger">
                            { formErrors[item._id + "=ext_refund_price"] }
                          </Form.Text>
                        </InputGroup>
                      </Col>
                    </Row>
                  </>
                );
            })}

            {editData &&
              editData.prices &&
              carCategories.map((item, index) => {
                const inEditData = editData.prices && editData.prices.find(
                  (item_) => item_.category == item._id
                );
                return (
                  !inEditData && <>
                    <Row className="mt-2">
                      <Col>
                        <Form.Group className="mb-3" controlId="formBasicText">
                          <Form.Label>Category Name</Form.Label>
                          <Form.Control
                            disabled={true}
                            type="text"
                            value={item.name}
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Label>Strikethrough Price</Form.Label>
                        <InputGroup className="mb-3" controlId="formBasicText">
                          <InputGroup.Text>
                            <PiCurrencyInr />
                          </InputGroup.Text>
                          <Form.Control
                            type="text"
                            name={item._id + "=strikethrough_price"}
                            onChange={handleOnChange}
                          />
                        </InputGroup>
                      </Col>
                      <Col>
                        <Form.Label>Actual Price</Form.Label>
                        <InputGroup className="mb-3" controlId="formBasicText">
                          <InputGroup.Text>
                            <PiCurrencyInr />
                          </InputGroup.Text>
                          <Form.Control
                            type="text"
                            name={item._id + "=actual_price"}
                            onChange={handleOnChange}
                          />
                        </InputGroup>
                      </Col>
                      <Col>
                        <Form.Label>Total Price</Form.Label>
                        <InputGroup className="mb-3" controlId="formBasicText">
                          <InputGroup.Text>
                            <PiCurrencyInr />
                          </InputGroup.Text>
                          <Form.Control
                            type="text"
                            disabled
                            name={item._id + "=actual_price"}
                            value={
                              editData &&
                              editData.prices &&
                              editData.prices.length > 0
                                ? (() => {
                                  console.log(editData.prices)
                                    const d = editData.prices.find(item_ => item_.category == item._id)
                                    console.log(d)
                                    return (
                                      d && Object.keys(d).length &&
                                      parseInt(d.actual_price) +
                                        parseInt(d.actual_price) *
                                          (parseInt(totalTaxValue) / 100)
                                    );
                                  })()
                                : "-"
                            }
                            onChange={handleOnChange}
                          />
                        </InputGroup>
                      </Col>
                    </Row>
                  </>
                );
            })}

            <Row className="mt-3">
              <Col>
                <Form.Check
                  name="visible"
                  type="switch"
                  id="custom-switch"
                  label="Visible"
                  defaultChecked={editData.visible}
                  onChange={handleOnChange}
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" onClick={handleFormSubmit}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Package Modal */}
      <Modal centered show={deleteId != null} onHide={() => setDeleteId(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Package</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this Package ?</p>
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


export default PackageList;