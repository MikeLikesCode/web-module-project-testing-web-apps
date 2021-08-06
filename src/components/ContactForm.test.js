import React from 'react';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', ()=>{
    render(<ContactForm/>)
});

test('renders the contact form header', ()=> {
    render(<ContactForm/>)
    const header = screen.queryByText('Contact Form')
    expect(header).toBeInTheDocument();
    expect(header).toBeTruthy();
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm/>)
    const firstName = screen.queryByLabelText('First Name*');
    userEvent.type(firstName, 'Mike');
    expect(firstName).toHaveValue('Mike');
    expect(screen.getByTestId('error').textContent).toEqual('Error: firstName must have at least 5 characters.')
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm/>)
    const submit = screen.getByRole("button");
    userEvent.click(submit)
    expect(screen.queryAllByText('Error: firstName must have at least 5 characters.' || 'Error: lastName is a required field.' || 'Error: email must be a valid email address.'));
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm/>)

    const firstName = screen.queryByLabelText('First Name*');
    userEvent.type(firstName, 'Mikey');
    expect(firstName).toHaveValue('Mikey');

    const lastName = screen.queryByLabelText('Last Name*');
    userEvent.type(lastName, 'Guerrero');
    expect(lastName).toHaveValue('Guerrero');

    const submit = screen.getByRole("button");
    userEvent.click(submit);

    expect(screen.getByTestId('error').textContent).toEqual('Error: email must be a valid email address.')

});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm/>)

    const firstName = screen.queryByLabelText('First Name*');
    userEvent.type(firstName, 'Mikey');
    expect(firstName).toHaveValue('Mikey');

    const lastName = screen.queryByLabelText('Last Name*');
    userEvent.type(lastName, 'Guerrero');
    expect(lastName).toHaveValue('Guerrero');

    const email = screen.queryByLabelText('Email*');
    userEvent.type(email, '2q');
    expect(email).toHaveValue('2q');

    const submit = screen.getByRole("button");
    userEvent.click(submit);
    
    expect(screen.getByTestId('error').textContent).toEqual('Error: email must be a valid email address.')

    
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm/>)

    const firstName = screen.queryByLabelText('First Name*');
    userEvent.type(firstName, 'Mikey');
    expect(firstName).toHaveValue('Mikey');

    const email = screen.queryByLabelText('Email*');
    userEvent.type(email, 'maikurusama@gmail.com');
    expect(email).toHaveValue('maikurusama@gmail.com');

    const submit = screen.getByRole("button");
    userEvent.click(submit);


    expect(screen.getByTestId('error').textContent).toEqual('Error: lastName is a required field.')
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm/>)
   
    const firstName = screen.queryByLabelText('First Name*');
    userEvent.type(firstName, 'Mikey');
    expect(firstName).toHaveValue('Mikey');

    const lastName = screen.queryByLabelText('Last Name*');
    userEvent.type(lastName, 'Guerrero');
    expect(lastName).toHaveValue('Guerrero');

    const email = screen.queryByLabelText('Email*');
    userEvent.type(email, 'maikurusama@gmail.com');
    expect(email).toHaveValue('maikurusama@gmail.com');

    const submit = screen.getByRole("button");
    userEvent.click(submit);

    const displayFirstName = screen.queryByTestId('firstnameDisplay').textContent
    const displayLastName = screen.queryByTestId('lastnameDisplay').textContent
    const displayEmail = screen.queryByTestId('emailDisplay').textContent
    const displayMessage = screen.queryByTestId('messageDisplay')

    await waitFor(() => {
        expect(displayFirstName).toEqual('First Name: Mikey')
        expect(displayLastName).toEqual(' Last Name: Guerrero')
        expect(displayEmail).toEqual('Email: maikurusama@gmail.com')
        expect(displayMessage).not.toEqual('Message: ')
    })
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm/>)
   
    const firstName = screen.queryByLabelText('First Name*');
    userEvent.type(firstName, 'Mikey');
    expect(firstName).toHaveValue('Mikey');

    const lastName = screen.queryByLabelText('Last Name*');
    userEvent.type(lastName, 'Guerrero');
    expect(lastName).toHaveValue('Guerrero');

    const email = screen.queryByLabelText('Email*');
    userEvent.type(email, 'maikurusama@gmail.com');
    expect(email).toHaveValue('maikurusama@gmail.com');

    const message = screen.queryByLabelText('Message');
    userEvent.type(message, 'Hello');
    expect(message).toHaveValue('Hello')

    const submit = screen.getByRole("button");
    userEvent.click(submit);

    const displayFirstName = screen.queryByTestId('firstnameDisplay').textContent
    const displayLastName = screen.queryByTestId('lastnameDisplay').textContent
    const displayEmail = screen.queryByTestId('emailDisplay').textContent
    const displayMessage = screen.queryByTestId('messageDisplay').textContent

    await waitFor(() => {
        expect(displayFirstName).toEqual('First Name: Mikey')
        expect(displayLastName).toEqual(' Last Name: Guerrero')
        expect(displayEmail).toEqual('Email: maikurusama@gmail.com')
        expect(displayMessage).toEqual('Message: Hello')
    })
});