/**
 * Created by kinneretzin on 07/09/2016.
 */


addPlugin({
    id: "deploymentNum",
    name: 'Number of deployments',
    description: 'blah blah blah',
    initialWidth: 4,
    initialHeight: 2,
    color: "violet",
    showHeader: false,
    render: function(plugin,data,context,pluginUtils) {

        if (!plugin.template) {
            return 'DeploymentNum: missing template';
        }

        return pluginUtils.buildFromTemplate(plugin.template);
    }
});