/**
 * Created by pposel on 11/08/2017.
 */

import React from 'react';
import { connect } from 'react-redux';
import { selectHomePage } from '../../actions/page';
import TemplateManagement from '../../components/templates/TemplateManagement';
import { getTemplates, createTemplate, updateTemplate, deleteTemplate, createPage, deletePage, selectTemplate, selectPage, clear} from '../../actions/templateManagement';

const mapStateToProps = (state, ownProps) => {
    var templateManagement = state.templateManagement || {};

    return {
        manager: state.manager,
        templates: templateManagement.templates,
        pages: templateManagement.pages,
        isLoading: templateManagement.isLoading,
        error: templateManagement.error
    };
};

const mapDispatchToProps = (dispatch, getState, ownProps) => {
    return {
        onTemplatesLoad: () => dispatch(getTemplates()),
        onTemplateCreate: template => dispatch(createTemplate(template)),
        onTemplateUpdate: template => dispatch(updateTemplate(template)),
        onTemplateDelete: templateId => dispatch(deleteTemplate(templateId)),
        onTemplateSelect: templateId => dispatch(selectTemplate(templateId)),
        onPageCreate: page => dispatch(createPage(page)),
        onPageDelete: pageId => dispatch(deletePage(pageId)),
        onPageSelect: pageId => dispatch(selectPage(pageId)),
        onClear: () => dispatch(clear()),
        onClose: () => dispatch(selectHomePage())
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TemplateManagement);