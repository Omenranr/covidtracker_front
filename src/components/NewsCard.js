import 'primeicons/primeicons.css';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import '../newscard.css';
import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

const NewsCard = (props) => {

    const {news} = props
    const header = (
        <img alt="Card" src={news.urlToImage} srcSet={news.urlToImage} />
    );
    const footer = (
        <span>
            <Button onClick={() => {window.open(news.url,'_blank')}} label="Voir l'article" icon="pi pi-check" style={{ marginRight: '.25em' }} />
        </span>
    );

    return (
        <Card 
            title={news.title} 
            subTitle={"Author: " + news.author + ", Published at: " + news.publishedAt + ", Source: "+news.source.name} 
            className="ui-card-shadow" 
            footer={footer} 
            header={header}
        >
            <div>{news.description}</div>
        </Card>
    )
}

export default NewsCard