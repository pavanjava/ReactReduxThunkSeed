import React, {Component} from 'react';
import {
    Breadcrumb, BreadcrumbItem, Card, CardBody, CardImg, CardText, CardTitle,
    Modal, ModalHeader, ModalBody, Button, Label, Row, Col
} from 'reactstrap';

import {Link} from "react-router-dom";
import {Control, LocalForm, Errors} from 'react-redux-form';
import {Loading} from "./LoadingComponent";
import {baseUrl} from "../shared/baseUrl";
import {FadeTransform, Fade, Stagger} from 'react-animation-components';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

class CommentForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isModalOpen: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
    }

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    handleSubmit(values) {
        this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
        this.toggleModal();
    }

    render() {

        const options = [1, 2, 3, 4, 5].map(i => {
            return (
                <option key={i} value={i}>{i}</option>
            );
        });

        return (
            <React.Fragment>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Login</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={(values) => this.handleSubmit(values)}>

                            <Row>
                                <Label htmlFor={"ratings"} md={12}>Rating</Label>
                            </Row>
                            <Row className={'form-group'}>
                                <Col md={12}>
                                    <Control.select model={".ratings"} type={'select'} name={'ratings'}
                                                    className={"form-control"}>
                                        {options}
                                    </Control.select>
                                </Col>
                            </Row>

                            <Row>
                                <Label htmlFor={"author"} md={12}>Your Name</Label>
                            </Row>
                            <Row className={'form-group'}>

                                <Col md={12}><Control.text model={".author"} id="author" name="author"
                                                           placeholder=''
                                                           className={"form-control"} validators={{
                                    required, minLength: minLength(3), maxLength: maxLength(15)
                                }}
                                />
                                    <Errors
                                        className={"text-danger"} model={".author"} show={"touched"}
                                        messages={{
                                            requied: "Required",
                                            minLength: 'Must be greater than 2 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }}
                                    />
                                </Col>
                            </Row>

                            <Row>
                                <Label htmlFor={"comment"} md={12}>Comments</Label>
                            </Row>
                            <Row className={'form-group'}>

                                <Col md={12}><Control.textarea model={'.comment'} id="comment" name="comment" rows={"6"}
                                                               placeholder='Feedback' className={"form-control"}
                                /></Col>
                            </Row>
                            <Row className={'form-group'}>
                                <Col md={12}>
                                    <Button type={'submit'} color={'primary'}>Submit</Button>
                                </Col>
                            </Row>
                        </LocalForm>
                    </ModalBody>
                </Modal>
                <Button type={"button"} outline onClick={this.toggleModal}><span
                    className="fa fa-pencil fa-lg mr-2"></span>Submit Comment</Button>
            </React.Fragment>
        );
    }
}

function RenderDish({dish}) {

    if (dish) {
        return (
            <FadeTransform in transformProps={{exitTransform: 'scale(0.5) translateY(-50%)'}}>
                <Card>
                    <CardImg width={'100%'} src={baseUrl + dish.image} alt={dish.name}/>
                    <CardBody>
                        <CardTitle>{dish.name}</CardTitle>
                        <CardText>{dish.description}</CardText>
                    </CardBody>
                </Card>
            </FadeTransform>
        );
    } else {
        return (
            <div></div>
        );
    }
}

function RenderComments({comments, postComment, dishId}) {
    if (comments != null && comments.length !== 0) {

        /*const commentResp = comments.map(comment => (
            <li key={comment.id}>
                <p>{comment.comment}</p>
                <p>-- {comment.author}, {new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit'
                }).format(new Date(Date.parse(comment.date)))}</p>
            </li>
        ));*/

        return (
            <div className="mt-1">
                <h4>Comments</h4>
                <ul className="unstyled-list">
                    <Stagger in>
                        {comments.map((comment) => {
                            return (
                                <Fade in>
                                    <li key={comment.id}>
                                        <p>{comment.comment}</p>
                                        <p>-- {comment.author} , {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}</p>
                                    </li>
                                </Fade>
                            );
                        })}
                    </Stagger>
                </ul>
                <CommentForm dishId={dishId} postComment={postComment}/>
            </div>
        );
    } else {
        return (
            <div></div>
        )
    }
}

const DishDetail = (props) => {
    if (props.isLoading) {
        return (
            <div className={'container'}>
                <div className={'row'}>
                    <Loading/>
                </div>
            </div>
        );
    } else if (props.errMess) {
        return (
            <div className={'container'}>
                <div className={'row'}>
                    <h4>{props.errMess}</h4>
                </div>
            </div>
        );
    } else if (props.dish != null) {
        return (
            <div className='container'>
                <Breadcrumb>
                    <BreadcrumbItem>
                        <Link to={'/home'}>Home</Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <Link to={'/menu'}>Menu</Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>
                        {props.dish.name}
                    </BreadcrumbItem>
                </Breadcrumb>
                <div className={'col-12'}>
                    <h3>{props.dish.name}</h3>
                    <hr/>
                </div>
                <div className="row">
                    <div className="col-md-5 m-1">
                        <RenderDish dish={props.dish}/>
                    </div>
                    <div className="col-md-5 m-1">
                        <RenderComments comments={props.comments} postComment={props.postComment}
                                        dishId={props.dish.id}/>
                    </div>
                </div>
            </div>
        )
    }
    else {
        return (
            <div></div>
        );
    }
}

export default DishDetail;