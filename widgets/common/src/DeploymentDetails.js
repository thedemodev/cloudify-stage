function DeploymentParameter({ name, value, as, headerStyle, subHeaderStyle }) {
    const { Header } = Stage.Basic;

    return (
        <Header as={as} style={{ marginBlockStart: 0, ...headerStyle }}>
            {name}
            <Header.Subheader style={subHeaderStyle}>{value}</Header.Subheader>
        </Header>
    );
}

DeploymentParameter.propTypes = {
    name: PropTypes.node.isRequired,
    value: PropTypes.node.isRequired,
    as: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    headerStyle: PropTypes.object,
    // eslint-disable-next-line react/forbid-prop-types
    subHeaderStyle: PropTypes.object
};

DeploymentParameter.defaultProps = {
    as: 'h5',
    headerStyle: {},
    subHeaderStyle: {}
};

export default function DeploymentDetails({
    big,
    customActions,
    customName,
    deployment,
    instancesCount,
    instancesStates,
    onSetVisibility
}) {
    const { Grid, ResourceVisibility } = Stage.Basic;
    const { NodeInstancesSummary } = Stage.Common;

    const showBlueprint = 'blueprint_id' in deployment;
    const showSiteName = 'site_name' in deployment && !_.isEmpty(deployment.site_name);
    const showCreated = 'created_at' in deployment;
    const showUpdated = 'updated_at' in deployment && deployment.created_at !== deployment.updated_at;
    const showCreator = 'created_by' in deployment;
    const showNodeInstances = instancesStates !== null;
    const as = big ? 'h3' : 'h5';
    const stackable = !big;

    return (
        <Grid stackable={stackable}>
            <Grid.Row>
                <Grid.Column width={4}>
                    <ResourceVisibility
                        allowedSettingTo={['tenant', 'global']}
                        className="rightFloated"
                        visibility={deployment.visibility}
                        onSetVisibility={onSetVisibility}
                    />
                    {customName || (
                        <DeploymentParameter
                            as="h3"
                            name={deployment.id}
                            value={deployment.description}
                            style={{ marginTop: 0 }}
                        />
                    )}
                </Grid.Column>
                {(showBlueprint || showSiteName) && (
                    <Grid.Column width={3}>
                        {showBlueprint && (
                            <DeploymentParameter as={as} name="Blueprint" value={deployment.blueprint_id} />
                        )}
                        {showSiteName && <DeploymentParameter as={as} name="Site Name" value={deployment.site_name} />}
                    </Grid.Column>
                )}
                {(showCreated || showUpdated) && (
                    <Grid.Column width={3}>
                        {showCreated && <DeploymentParameter as={as} name="Created" value={deployment.created_at} />}
                        {showUpdated && <DeploymentParameter as={as} name="Updated" value={deployment.updated_at} />}
                    </Grid.Column>
                )}
                {showCreator && (
                    <Grid.Column width={2}>
                        <DeploymentParameter as={as} name="Creator" value={deployment.created_by} />
                    </Grid.Column>
                )}
                {showNodeInstances && (
                    <Grid.Column width={customActions ? 3 : 4}>
                        <DeploymentParameter
                            as={as}
                            name={`Node Instances (${instancesCount})`}
                            value={<NodeInstancesSummary instancesStates={instancesStates} />}
                            subHeaderStyle={{ lineHeight: `${big ? '1' : '2'}rem` }}
                        />
                    </Grid.Column>
                )}
                {customActions && <Grid.Column width={1}>{customActions}</Grid.Column>}
            </Grid.Row>
        </Grid>
    );
}

DeploymentDetails.propTypes = {
    deployment: PropTypes.shape({
        id: PropTypes.string.isRequired,
        visibility: PropTypes.string.isRequired,
        blueprint_id: PropTypes.string,
        description: PropTypes.string,
        site_name: PropTypes.string,
        created_at: PropTypes.string,
        updated_at: PropTypes.string,
        created_by: PropTypes.string
    }).isRequired,
    instancesCount: PropTypes.number.isRequired,
    instancesStates: PropTypes.objectOf(PropTypes.number).isRequired,
    onSetVisibility: PropTypes.func.isRequired,
    big: PropTypes.bool,
    customName: PropTypes.node,
    customActions: PropTypes.node
};

DeploymentDetails.defaultProps = {
    big: false,
    customName: null,
    customActions: null
};

Stage.defineCommon({
    name: 'DeploymentDetails',
    common: DeploymentDetails
});
