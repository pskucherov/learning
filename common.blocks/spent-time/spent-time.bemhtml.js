block('spent-time').content()(function() {
    var dr = this.ctx.duration;
    return [
        dr.d ? {
            elem: 'box',
            content: 'Дней: ' + dr.d
        } : '',
        ' ',
        dr.h ? {
            elem: 'box',
            content: 'Часов: ' + dr.h
        } : '',
        ' ',
        dr.m ? {
            elem: 'box',
            content: 'Минут: ' + dr.m
        } : '',
        ' ',
        dr.s ? {
            elem: 'box',
            content: 'Секунд: ' + dr.s
        } : ''
    ];
});
