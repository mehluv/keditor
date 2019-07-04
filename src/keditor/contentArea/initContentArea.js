import TOOLBAR_TYPE from '../constants/toolbarType';
import CSS_CLASS from '../constants/cssClass';
import ACTION_TYPE from '../constants/actionType';
import openSnippetModal from '../modal/openSnippetModal';
import generateToolbar from '../utils/generateToolbar';
import closeSidebar from '../sidebar/closeSidebar';
import convertToContainer from '../container/convertToContainer';

export default function (contentArea, dontInitToolbar) {
    let self = this;
    let options = self.options;
    
    contentArea.addClass(CSS_CLASS.CONTENT_AREA);
    let content = contentArea.html();
    let contentAreaInner = $(`<div class="${CSS_CLASS.CONTENT_AREA_INNER}"></div>`).html(content);
    contentArea.html(contentAreaInner);
    
    if (typeof options.onBeforeInitContentArea === 'function') {
        options.onBeforeInitContentArea.call(self, contentArea);
    }
    
    if (!dontInitToolbar) {
        let contentAreaToolbar = $(generateToolbar.call(self, TOOLBAR_TYPE.CONTENT_AREA));
        contentArea.append(contentAreaToolbar);
        contentAreaToolbar.children(`.${CSS_CLASS.ADD_CONTENT}`).on('click', function (e) {
            e.preventDefault();
    
            openSnippetModal.call(self, contentAreaInner, ACTION_TYPE.APPEND, true, true);
        });
    }
    
    contentAreaInner.sortable({
        handle: `.${CSS_CLASS.TOOLBAR_CONTAINER}:not(.${CSS_CLASS.TOOLBAR_SUB_CONTAINER}) .${CSS_CLASS.CONTAINER_MOVE}`,
        items: '> section',
        helper: 'clone',
        connectWith: `.${CSS_CLASS.CONTENT_AREA}`,
        axis: 'y',
        tolerance: 'pointer',
        receive: function (event, ui) {
            let helper = ui.helper;
            let item = ui.item;
            
            if (helper) {
                helper.remove();
            }
            
            closeSidebar.call(self);
            
            if (typeof options.onContentChanged === 'function') {
                options.onContentChanged.call(self, event, contentArea);
            }
            
            item.addClass(CSS_CLASS.UI_DRAGGING);
        },
        start: function (e, ui) {
            ui.item.addClass(CSS_CLASS.UI_DRAGGING);
        },
        stop: function (e, ui) {
            if (ui.helper) {
                ui.helper.remove();
            }
            ui.item.removeClass(CSS_CLASS.UI_DRAGGING);
        }
    });
    
    contentAreaInner.children('section').each(function () {
        convertToContainer.call(self, contentArea, $(this));
    });
    
    if (typeof options.onInitContentArea === 'function') {
        let contentData = options.onInitContentArea.call(self, contentArea);
        if (contentData && contentData.length > 0) {
            $.each(contentData, function () {
                convertToContainer.call(self, contentArea, $(this));
            });
        }
    }
};
