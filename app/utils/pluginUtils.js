/**
 * Created by kinneretzin on 11/09/2016.
 */

import momentImport from 'moment';
import anglarImport from 'angular';

export default class PluginUtils {
    static buildFromTemplate(html, data) {

        var compiled = _.template(html);
        return compiled(data);
    }

    static moment = momentImport;
    static jQuery = $;
    static angular = anglarImport;
}