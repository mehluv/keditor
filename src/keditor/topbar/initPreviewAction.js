import CSS_CLASS from '../constants/cssClass';
import initDynamicContent from '../component/initDynamicContent';
import getContent from '../getContent';
import ICON from '../constants/icon';

export default function () {
    let self = this;
    let options = self.options;
    let btnPreview = $(`<a href="javascript:void(0);" title="${options.locale.previewOff}" class="${CSS_CLASS.UI} ${CSS_CLASS.TOPBAR_BUTTON}">${ICON.PREVIEW_OFF}</a>`);
    
    self.previewArea = $(`<div class="${CSS_CLASS.PREVIEW_AREA}"></div>`);
    self.contentAreasWrapper.after(self.previewArea);
    
    btnPreview.on('click', function (e) {
        e.preventDefault();
        
        let isPreviewOn = !btnPreview.hasClass(CSS_CLASS.STATE_ACTIVE);
        
        btnPreview.html(isPreviewOn ? ICON.PREVIEW_ON : ICON.PREVIEW_OFF);
        btnPreview[isPreviewOn ? 'addClass' : 'removeClass'](CSS_CLASS.STATE_ACTIVE);
        btnPreview.attr('title', isPreviewOn ? options.locale.previewOn : options.locale.previewOff);
        self.iframeBody[isPreviewOn ? 'addClass' : 'removeClass'](CSS_CLASS.STATE_PREVIEWING);
        
        isPreviewOn && self.previewArea.html(getContent.call(self)).find('[data-dynamic-href]').each(function () {
            let dynamicElement = $(this);
            dynamicElement.html('Loading...');
            initDynamicContent.call(self, dynamicElement);
        });
    });
    
    self.topbarRight.append(btnPreview);
};
