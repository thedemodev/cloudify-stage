/**
 * Created by kinneretzin on 07/09/2016.
 */

addPlugin({
    id: 'githubExamples',
    name: "Cloudify github examples",
    description: 'This plugin shows a list of cloudify example repositories',
    initialWidth: 8,
    initialHeight: 4,
    color: "teal",
    fetchUrl: 'https://api.github.com/search/repositories?q=-nfv+in:name+fork:true+user:cloudify-examples',
    render: function(widget,data,context,pluginUtils) {
        if (!widget.plugin.template) {
            return 'Inputs: missing template';
        }

        return pluginUtils.buildFromTemplate(widget.plugin.template,data);

    }
});