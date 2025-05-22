import React, { useState, useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';



function App() {

  const [bots, setBots] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [botName, setBotName] = useState('');

  const [botToken, setBotToken] = useState('');



  useEffect(() => {

    fetch('/api/bot-manager')

      .then(res => res.json())

      .then(data => setBots(Object.keys(data.bots || {}).map(name => ({

        name,

        running: data.bots[name].running

      }))));

  }, []);



  const handleCreateBot = () => {

    fetch('/api/bot-manager', {

      method: 'POST',

      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({ action: 'create', botName, botToken })

    })

    .then(res => res.json())

    .then(() => {

      setBots([...bots, { name: botName, running: false }]);

      setShowModal(false);

      setBotName('');

      setBotToken('');

    });

  };



  const handleBotAction = (botName, action) => {

    fetch('/api/bot-manager', {

      method: 'POST',

      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({ action, botName })

    })

    .then(res => res.json())

    .then(() => {

      setBots(bots.map(bot => 

        bot.name === botName ? { ...bot, running: action === 'start' } : bot

      ));

    });

  };



  const handleDeleteBot = (botName) => {

    fetch('/api/bot-manager', {

      method: 'POST',

      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({ action: 'delete', botName })

    })

    .then(res => res.json())

    .then(() => {

      setBots(bots.filter(bot => bot.name !== botName));

    });

  };



  return (

    <Container className="mt-5">

      <Row className="mb-4">

        <Col>

          <h1>Telegram Bot Hosting</h1>

          <Button variant="primary" onClick={() => setShowModal(true)}>

            Create New Bot

          </Button>

        </Col>

      </Row>



      <Row>

        {bots.map((bot, index) => (

          <Col md={4} key={index} className="mb-4">

            <Card>

              <Card.Body>

                <Card.Title>{bot.name}</Card.Title>

                <Card.Text>

                  Status: {bot.running ? 'Running' : 'Stopped'}

                </Card.Text>

                <div className="d-flex justify-content-between">

                  {bot.running ? (

                    <Button variant="danger" onClick={() => handleBotAction(bot.name, 'stop')}>

                      Stop

                    </Button>

                  ) : (

                    <Button variant="success" onClick={() => handleBotAction(bot.name, 'start')}>

                      Start

                    </Button>

                  )}

                  <Button variant="warning" onClick={() => handleDeleteBot(bot.name)}>

                    Delete

                  </Button>

                </div>

              </Card.Body>

            </Card>

          </Col>

        ))}

      </Row>



      <Modal show={showModal} onHide={() => setShowModal(false)}>

        <Modal.Header closeButton>

          <Modal.Title>Create New Bot</Modal.Title>

        </Modal.Header>

        <Modal.Body>

          <Form>

            <Form.Group className="mb-3">

              <Form.Label>Bot Name</Form.Label>

              <Form.Control 

                type="text" 

                value={botName}

                onChange={(e) => setBotName(e.target.value)}

              />

            </Form.Group>

            <Form.Group className="mb-3">

              <Form.Label>Bot Token</Form.Label>

              <Form.Control 

                type="text" 

                value={botToken}

                onChange={(e) => setBotToken(e.target.value)}

                placeholder="From @BotFather"

              />

            </Form.Group>

          </Form>

        </Modal.Body>

        <Modal.Footer>

          <Button variant="secondary" onClick={() => setShowModal(false)}>

            Close

          </Button>

          <Button variant="primary" onClick={handleCreateBot}>

            Create Bot

          </Button>

        </Modal.Footer>

      </Modal>

    </Container>

  );

}



export default App;
