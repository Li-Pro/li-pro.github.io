let lg = document.getElementById('lightgallery');

lg.addEventListener(
    "onSlideClick",
    function(event){
        // event.target is slide parent
        // let href = event.target?.getAttribute("ext-slide-href");
        let lg_uid = event.target?.getAttribute("lg-uid");
        let index = window.lgData[lg_uid].index;
        let href = event.target?.children[index].getAttribute('ext-slide-href');

        if (href !== null) {
            window.open(href);
        } else {
            console.error(`Failed to load slide href of target: ${event.target}`);
            console.error(event);
        }
    }
);

lightGallery(lg);
