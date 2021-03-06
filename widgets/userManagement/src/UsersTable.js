/**
 * Created by pposel on 30/01/2017.
 */
import Actions from './actions';
import CreateModal from './CreateModal';
import GroupModal from './GroupModal';
import MenuAction from './MenuAction';
import PasswordModal from './PasswordModal';
import TenantModal from './TenantModal';
import UserDetails from './UserDetails';

export default class UsersTable extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            error: null,
            showModal: false,
            modalType: '',
            user: UsersTable.EMPTY_USER,
            tenants: {},
            groups: {},
            activateLoading: false,
            settingUserRoleLoading: false
        };
    }

    static EMPTY_USER = { username: '' };

    shouldComponentUpdate(nextProps, nextState) {
        const { data, widget } = this.props;
        return (
            !_.isEqual(widget, nextProps.widget) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(data, nextProps.data)
        );
    }

    refreshData() {
        const { toolbox } = this.props;
        toolbox.refresh();
    }

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('users:refresh', this.refreshData, this);
    }

    componentWillUnmount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().off('users:refresh', this.refreshData);
    }

    fetchData(fetchParams) {
        const { toolbox } = this.props;
        return toolbox.refresh(fetchParams);
    }

    selectUser(userName) {
        const { toolbox } = this.props;
        const selectedUserName = toolbox.getContext().getValue('userName');
        toolbox.getContext().setValue('userName', userName === selectedUserName ? null : userName);
    }

    getAvailableTenants(value, user, showModal = true) {
        const { toolbox } = this.props;
        toolbox.loading(true);

        const actions = new Actions(toolbox);
        actions
            .doGetTenants()
            .then(tenants => {
                this.setState({
                    error: null,
                    tenants,
                    user: showModal ? user : UsersTable.EMPTY_USER,
                    modalType: showModal ? value : '',
                    showModal
                });
                toolbox.loading(false);
            })
            .catch(err => {
                this.setState({ error: err.message });
                toolbox.loading(false);
            });
    }

    getAvailableGroups(value, user) {
        const { toolbox } = this.props;
        toolbox.loading(true);

        const actions = new Actions(toolbox);
        actions
            .doGetGroups()
            .then(groups => {
                this.setState({ error: null, user, groups, modalType: value, showModal: true });
                toolbox.loading(false);
            })
            .catch(err => {
                this.setState({ error: err.message });
                toolbox.loading(false);
            });
    }

    showModal(value, user) {
        if (value === MenuAction.EDIT_TENANTS_ACTION) {
            this.getAvailableTenants(value, user);
        } else if (value === MenuAction.EDIT_GROUPS_ACTION) {
            this.getAvailableGroups(value, user);
        } else if (value === MenuAction.ACTIVATE_ACTION) {
            this.activateUser(user);
        } else if (value === MenuAction.DEACTIVATE_ACTION && !this.isCurrentUser(user)) {
            this.deactivateUser(user);
        } else if (value === MenuAction.SET_ADMIN_USER_ROLE_ACTION) {
            this.setRole(user, true);
        } else if (value === MenuAction.SET_DEFAULT_USER_ROLE_ACTION && !this.isCurrentUser(user)) {
            this.setRole(user, false);
        } else {
            this.setState({ user, modalType: value, showModal: true });
        }
    }

    hideModal() {
        this.setState({ showModal: false });
    }

    handleError(message) {
        this.setState({ error: message });
    }

    isCurrentUser(user) {
        const { toolbox } = this.props;
        return toolbox.getManager().getCurrentUsername() === user.username;
    }

    isUserInAdminGroup(user) {
        return _.has(user.group_system_roles, Stage.Common.Consts.sysAdminRole);
    }

    deleteUser() {
        const { toolbox } = this.props;
        const { user } = this.state;
        toolbox.loading(true);

        const actions = new Actions(toolbox);
        actions
            .doDelete(user.username)
            .then(() => {
                this.hideModal();
                this.setState({ error: null });
                toolbox.loading(false);
                toolbox.refresh();
            })
            .catch(err => {
                this.hideModal();
                this.setState({ error: err.message });
                toolbox.loading(false);
            });
    }

    setRole(user, isAdmin) {
        const { toolbox } = this.props;
        toolbox.loading(true);
        this.setState({ settingUserRoleLoading: user.username });

        const actions = new Actions(toolbox);
        actions
            .doSetRole(user.username, Stage.Common.RolesUtil.getSystemRole(isAdmin))
            .then(() => {
                this.setState({ error: null, settingUserRoleLoading: false });
                toolbox.loading(false);
                if (this.isCurrentUser(user) && !isAdmin) {
                    toolbox.getEventBus().trigger('menu.users:logout');
                } else {
                    toolbox.refresh();
                }
            })
            .catch(err => {
                this.setState({ error: err.message, settingUserRoleLoading: false });
                toolbox.loading(false);
            });
    }

    activateUser(user) {
        const { toolbox } = this.props;
        toolbox.loading(true);
        this.setState({ activateLoading: user.username });

        const actions = new Actions(toolbox);
        actions
            .doActivate(user.username)
            .then(() => {
                this.setState({ error: null, activateLoading: false });
                toolbox.loading(false);
                toolbox.refresh();
            })
            .catch(err => {
                this.setState({ error: err.message, activateLoading: false });
                toolbox.loading(false);
            });
    }

    deactivateUser(user) {
        const { toolbox } = this.props;
        toolbox.loading(true);
        this.setState({ activateLoading: user.username });

        const actions = new Actions(toolbox);
        actions
            .doDeactivate(user.username)
            .then(() => {
                this.setState({ error: null, activateLoading: false });
                toolbox.loading(false);
                if (this.isCurrentUser(user)) {
                    toolbox.getEventBus().trigger('menu.users:logout');
                } else {
                    toolbox.refresh();
                    toolbox.getEventBus().trigger('userGroups:refresh');
                }
            })
            .catch(err => {
                this.setState({ error: err.message, activateLoading: false });
                toolbox.loading(false);
            });
    }

    render() {
        const {
            activateLoading,
            error,
            groups,
            modalType,
            settingUserRoleLoading,
            showModal,
            tenants,
            user
        } = this.state;
        const { data, roles, toolbox, widget } = this.props;
        const NO_DATA_MESSAGE = 'There are no Users available in manager. Click "Add" to add Users.';
        const { Checkbox, Confirm, DataTable, ErrorMessage, Label, Loader, Popup } = Stage.Basic;
        const tableName = 'usersTable';

        return (
            <div>
                <ErrorMessage error={error} onDismiss={() => this.setState({ error: null })} autoHide />

                <DataTable
                    fetchData={this.fetchData.bind(this)}
                    totalSize={data.total}
                    pageSize={widget.configuration.pageSize}
                    sortColumn={widget.configuration.sortColumn}
                    sortAscending={widget.configuration.sortAscending}
                    searchable
                    className={tableName}
                    noDataMessage={NO_DATA_MESSAGE}
                >
                    <DataTable.Column label="Username" name="username" width="37%" />
                    <DataTable.Column label="Last login" name="last_login_at" width="18%" />
                    <DataTable.Column label="Admin" width="10%" />
                    <DataTable.Column label="Active" name="active" width="10%" />
                    <DataTable.Column label="# Groups" width="10%" />
                    <DataTable.Column label="# Tenants" width="10%" />
                    <DataTable.Column label="" width="5%" />
                    {data.items.map(item => {
                        const isAdminCheckbox = (item, disabled) => (
                            <Checkbox
                                checked={item.isAdmin}
                                disabled={disabled || item.username === Stage.Common.Consts.adminUsername}
                                onChange={() =>
                                    item.isAdmin
                                        ? this.showModal(MenuAction.SET_DEFAULT_USER_ROLE_ACTION, item)
                                        : this.showModal(MenuAction.SET_ADMIN_USER_ROLE_ACTION, item)
                                }
                                onClick={e => {
                                    e.stopPropagation();
                                }}
                            />
                        );

                        return (
                            <DataTable.RowExpandable key={item.username} expanded={item.isSelected}>
                                <DataTable.Row
                                    id={`${tableName}_${item.username}`}
                                    key={item.username}
                                    selected={item.isSelected}
                                    onClick={this.selectUser.bind(this, item.username)}
                                >
                                    <DataTable.Data>{item.username}</DataTable.Data>
                                    <DataTable.Data>{item.last_login_at}</DataTable.Data>
                                    <DataTable.Data className="center aligned">
                                        {settingUserRoleLoading === item.username ? (
                                            <Loader active inline size="mini" />
                                        ) : this.isUserInAdminGroup(item) &&
                                          item.username !== Stage.Common.Consts.adminUsername ? (
                                            <Popup>
                                                <Popup.Trigger>{isAdminCheckbox(item, true)}</Popup.Trigger>
                                                <Popup.Content>
                                                    To remove the administrator privileges for this user, remove the
                                                    user from the group that is assigned administrator privileges.
                                                </Popup.Content>
                                            </Popup>
                                        ) : (
                                            isAdminCheckbox(item, false)
                                        )}
                                    </DataTable.Data>
                                    <DataTable.Data className="center aligned">
                                        {activateLoading === item.username ? (
                                            <Loader active inline size="mini" />
                                        ) : (
                                            <Checkbox
                                                checked={item.active}
                                                onChange={() =>
                                                    item.active
                                                        ? this.showModal(MenuAction.DEACTIVATE_ACTION, item)
                                                        : this.showModal(MenuAction.ACTIVATE_ACTION, item)
                                                }
                                                onClick={e => {
                                                    e.stopPropagation();
                                                }}
                                            />
                                        )}
                                    </DataTable.Data>
                                    <DataTable.Data>
                                        <Label className="green" horizontal>
                                            {item.groupCount}
                                        </Label>
                                    </DataTable.Data>
                                    <DataTable.Data>
                                        <Label className="blue" horizontal>
                                            {item.tenantCount}
                                        </Label>
                                    </DataTable.Data>
                                    <DataTable.Data className="center aligned">
                                        <MenuAction item={item} onSelectAction={this.showModal.bind(this)} />
                                    </DataTable.Data>
                                </DataTable.Row>
                                <DataTable.DataExpandable key={item.username}>
                                    <UserDetails data={item} toolbox={toolbox} onError={this.handleError.bind(this)} />
                                </DataTable.DataExpandable>
                            </DataTable.RowExpandable>
                        );
                    })}
                    <DataTable.Action>
                        <CreateModal roles={roles} toolbox={toolbox} />
                    </DataTable.Action>
                </DataTable>

                <PasswordModal
                    open={modalType === MenuAction.SET_PASSWORD_ACTION && showModal}
                    user={user}
                    onHide={this.hideModal.bind(this)}
                    toolbox={toolbox}
                />

                <TenantModal
                    open={modalType === MenuAction.EDIT_TENANTS_ACTION && showModal}
                    user={user}
                    tenants={tenants}
                    onHide={this.hideModal.bind(this)}
                    toolbox={toolbox}
                />

                <GroupModal
                    open={modalType === MenuAction.EDIT_GROUPS_ACTION && showModal}
                    user={user}
                    groups={groups}
                    onHide={this.hideModal.bind(this)}
                    toolbox={toolbox}
                />

                <Confirm
                    content={`Are you sure you want to remove user ${user.username}?`}
                    open={modalType === MenuAction.DELETE_ACTION && showModal}
                    onConfirm={this.deleteUser.bind(this)}
                    onCancel={this.hideModal.bind(this)}
                />

                <Confirm
                    content={
                        'Are you sure you want to remove your administrator privileges? ' +
                        'You will be logged out of the system so the changes take effect.'
                    }
                    open={modalType === MenuAction.SET_DEFAULT_USER_ROLE_ACTION && showModal}
                    onConfirm={this.setRole.bind(this, user, false)}
                    onCancel={this.hideModal.bind(this)}
                />

                <Confirm
                    content="Are you sure you want to deactivate current user and log out?"
                    open={modalType === MenuAction.DEACTIVATE_ACTION && showModal}
                    onConfirm={this.deactivateUser.bind(this, user)}
                    onCancel={this.hideModal.bind(this)}
                />
            </div>
        );
    }
}
