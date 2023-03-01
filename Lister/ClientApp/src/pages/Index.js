import React, { Component, useState, useEffect } from 'react'
import ButtonGroup from "./../components/ButtonGroup"
import Button from "./../components/Button"
import List from "./../components/List"
import ListItem from "./../components/ListItem"
import './Index.css'


export function Index() {
    const [list, setList] = useState([])
    const [originalList, setOriginalList] = useState([])
    const [fileType, setFileType] = useState(undefined)
    const [updateAction, setUpdateAction] = useState('original')

    const importFile = async () => {
        var input = document.createElement('input');
        input.type = 'file';
        input.onchange = async () => {
            const files = Array.from(input.files)
            const file = files[0]
            if (file == undefined) {
                return;
            }

            const parsedList = await ListParser.parseList(file)
            setOriginalList(parsedList)
            setList(parsedList)
            setFileType(file.type)
        };
        input.click()
    }

    const exportFile = async () => {
        const filename = 'Результат'
        const data = list.join(', ')

        const a = document.createElement('a')
        const file = new Blob([data], { type: fileType })

        a.href = URL.createObjectURL(file)
        a.download = filename
        a.click()
    }

    // Обновить список по команде
    useEffect(() => {
        (async () => {
            switch (updateAction) {
                case 'original':
                case 'sortByAsc':
                case 'sortByDesc':
                case 'reverse':
                    break
                default:
                    throw new Error('Некорректная команда обновления')
            }

            if (updateAction === 'original') {
                setList(originalList)
            } else {
                const inputData = updateAction === 'reverse' ? originalList : list
                const response = await fetch('list/' + updateAction, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify({
                        values: inputData
                    }),
                });
                const data = await response.json()
                setList(data.values)
            }
        })()
    }, [updateAction])

    return (
        <div className='content'>
            <div className='buttonPanel'>
                <Button onClick={importFile} size='large'>Импорт</Button>
                <ButtonGroup>
                    <Button
                        onClick={() => setUpdateAction('original')}
                        selected={updateAction === 'original'}>Оригинал</Button>
                    <Button
                        onClick={() => setUpdateAction('reverse')}
                        selected={updateAction === 'reverse'}>Реверс</Button>
                    <Button
                        onClick={() => setUpdateAction('sortByAsc')}
                        selected={updateAction === 'sortByAsc'}>По возрастанию</Button>
                    <Button
                        onClick={() => setUpdateAction('sortByDesc')}
                        selected={updateAction === 'sortByDesc'}>По убыванию</Button>
                </ButtonGroup>
                <Button onClick={exportFile} size='large'>Экспорт</Button>
            </div>
            <List>
                {
                    list.map((item) => {
                        return <ListItem key={item}>{item}</ListItem>
                    })
                }
            </List>
        </div>
    )
}



class ListParser {
    static async parseList(file) {
        const grabChain = new GrabChain(file)

        // Установить обработчики
        grabChain.handlers = [PlainTextHandler.handler]

        const list = await grabChain.grabItem()
        return list
    }
}

/// Цепочка обработчиков
/// 
/// Каждый обработчик принимает данные, возвращает что-либо или ничего.
class GrabChain {
    constructor(data) {
        this.handlers = []
        this.data = data
    }

    /// Запускает цепочку обработчиков до первого удачного результата. Этот результат возвращается, а все последующие обработчики игнорируются.
    async grabItem() {
        for (var i = 0; i < this.handlers.length; ++i) {
            const item = await this.handlers[i](this.data)
            if (item !== undefined) {
                return item
            }
        }
    }
}

class PlainTextHandler {
    /// Обработчик принимает File, возвращает распарсенный массив строк или ничего.
    static async handler(file) {
        if (file.type !== 'text/plain') {
            return
        }

        const raw_text = await file.text()
        return PlainTextHandler.parse(raw_text)
    }

    static parse(text) {
        return text.split(',')
            .map((x) => x.trim())
            .filter((x) => x !== '')
    }
}