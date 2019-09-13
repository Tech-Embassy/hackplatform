import React, { useEffect, useState, useCallback } from 'react';
import styles from './EditRegistrationDrawer.module.scss';

import { connect } from 'react-redux';
import moment from 'moment';
import {
    Modal,
    Descriptions,
    Rate,
    notification,
    Popover,
    Divider as AntDivider,
    Button as AntButton,
    Tag,
    PageHeader,
    Row,
    Col,
    Card,
    Drawer,
    List,
    Select
} from 'antd';
import { isEqual, groupBy, find } from 'lodash-es';
import { RegistrationFields, Skills, Roles, Misc } from '@hackjunction/shared';

import PageWrapper from 'components/PageWrapper';
import Button from 'components/generic/Button';
import Divider from 'components/generic/Divider';
import DescriptionItem from 'components/generic/DescriptionItem';
import RegistrationsService from 'services/registrations';

import * as OrganiserSelectors from 'redux/organiser/selectors';
import * as AuthSelectors from 'redux/auth/selectors';
import MiscUtils from 'utils/misc';
import UserSelectModal from 'components/modals/UserSelectModal';

const EditRegistrationDrawerInner = ({ idToken, event, registration, organisers, organisersMap, onEdit }) => {
    const initialValues = {
        rating: registration.rating,
        assignedTo: registration.assignedTo,
        tags: registration.tags
    };
    const [formValues, setFormValues] = useState(initialValues);
    const dirty = !isEqual(formValues, initialValues);

    const handleEdit = (field, value) => {
        setFormValues({
            ...formValues,
            [field]: value
        });
    };

    const renderAssignedTo = () => {
        if (formValues.assignedTo) {
            const user = organisersMap[formValues.assignedTo];
            return user ? `${user.firstName} ${user.lastName}` : '???';
        }
        return 'No one';
    };

    // renderTrigger, onDone, onCancel, loading, (userProfiles = []), title, (allowMultiple = true);
    const renderActions = () => {
        return (
            <React.Fragment>
                <List.Item>
                    <List.Item.Meta
                        title="Rating"
                        description={<Rate value={formValues.rating} onChange={value => handleEdit('rating', value)} />}
                    ></List.Item.Meta>
                </List.Item>
                <List.Item
                    actions={[
                        <UserSelectModal
                            renderTrigger={showModal => <AntButton onClick={showModal}>Change</AntButton>}
                            onDone={value => handleEdit('assignedTo', value.userId)}
                            allowMultiple={false}
                            userProfiles={organisers}
                        />
                    ]}
                >
                    <List.Item.Meta title={'Assigned to'} description={renderAssignedTo()}></List.Item.Meta>
                </List.Item>
                <List.Item>
                    <List.Item.Meta
                        title="Tags"
                        description={
                            <Select
                                placeholder="Select tags"
                                size="large"
                                value={formValues.tags}
                                style={{ width: '100%' }}
                                onChange={value => handleEdit('tags', value)}
                                mode="multiple"
                            >
                                {event.tags.map(tag => (
                                    <Select.Option value={tag.label}>
                                        <Tag color={tag.color}>{tag.label}</Tag>
                                    </Select.Option>
                                ))}
                            </Select>
                        }
                    ></List.Item.Meta>
                </List.Item>
                <Divider size={1} />
                <Button
                    text="Save changes"
                    block
                    theme="accent"
                    button={{
                        onClick: () => onEdit(formValues),
                        disabled: !dirty
                    }}
                />
            </React.Fragment>
        );
    };

    const renderContent = () => {
        if (!registration) return null;
        const fields = Object.keys(registration.answers);
        const grouped = groupBy(fields, field => RegistrationFields.getCategory(field));
        const categoryNames = Object.keys(grouped).filter(key => key !== '');

        return (
            <React.Fragment>
                {categoryNames.map(name => (
                    <React.Fragment key={name}>
                        <AntDivider>
                            <h3>{name}</h3>
                        </AntDivider>
                        {grouped[name].map(field => {
                            let label = RegistrationFields.fieldToLabelMap[field];
                            if (!label) {
                                const customField = find(event.registrationQuestions, f => f.name === field);
                                if (customField) {
                                    label = customField.label;
                                }
                            }
                            return (
                                <DescriptionItem
                                    title={label}
                                    content={registration.answers[field]}
                                    fieldName={field}
                                />
                            );
                        })}
                    </React.Fragment>
                ))}
                {event.customQuestions.map(section => {
                    const sectionAnswers = registration.answers[section.name] || {};
                    return (
                        <React.Fragment key={section.name}>
                            <AntDivider>
                                <h3>{section.label}</h3>
                            </AntDivider>
                            {section.questions.map(question => {
                                return (
                                    <DescriptionItem title={question.label} content={sectionAnswers[question.name]} />
                                );
                            })}
                        </React.Fragment>
                    );
                })}
            </React.Fragment>
        );
    };

    return (
        <React.Fragment>
            {renderActions()}
            {renderContent()}
        </React.Fragment>
    );
};

const EditRegistrationDrawer = ({ idToken, event, registrationId, organisers, organisersMap, onEdited }) => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [registration, setRegistration] = useState();
    const { slug } = event;

    useEffect(() => {
        if (registrationId && visible) {
            setLoading(true);
            RegistrationsService.getFullRegistration(idToken, slug, registrationId)
                .then(data => {
                    setRegistration(data);
                })
                .catch(e => {
                    setError(true);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [idToken, registrationId, slug, visible]);

    const handleClose = useCallback(() => {
        setVisible(false);
    }, []);

    const handleEdit = async data => {
        setLoading(true);
        await MiscUtils.sleep(1000);
        RegistrationsService.editRegistration(idToken, slug, registrationId, data)
            .then(data => {
                notification.success({
                    message: 'Changes saved!'
                });
                onEdited(data);
                handleClose();
            })
            .catch(err => {
                notification.error({
                    message: 'Something went wrong',
                    description: 'Your changes were not saved'
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <React.Fragment>
            <Drawer
                title="Edit registration"
                placement="right"
                width={640}
                closable={true}
                onClose={handleClose}
                visible={visible}
                getContainer={false}
            >
                <PageWrapper loading={loading || !registration} error={error}>
                    <EditRegistrationDrawerInner
                        registration={registration}
                        event={event}
                        organisers={organisers}
                        organisersMap={organisersMap}
                        onEdit={handleEdit}
                    />
                </PageWrapper>
            </Drawer>
            <AntButton onClick={setVisible}>Open</AntButton>
        </React.Fragment>
    );
};

const mapStateToProps = state => ({
    event: OrganiserSelectors.event(state),
    idToken: AuthSelectors.getIdToken(state),
    organisersMap: OrganiserSelectors.organisersMap(state),
    organisers: OrganiserSelectors.organisers(state)
});

export default connect(mapStateToProps)(EditRegistrationDrawer);