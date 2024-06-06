# ia-store

`ia-store` is a state management library for Angular applications that enables data persistence with encryption.

Synchronization between Tabs
The library supports synchronization between multiple tabs. If data changes in one tab, it will automatically be reflected in other open tabs of the same application.

## Install

To install the library in your Angular project, run: `npm install ia-store`

# Configuration

The encryption key must be configured in AppModule using the forRoot method.
Make sure to import IaStoreModule into the AppModule to configure the library properly.

src/app/app.module.ts

@NgModule({
declarations: [AppComponent],
imports: [
BrowserModule,
IaStoreModule.forRoot('myKey') // Set the encryption key here
],
providers: [],
bootstrap: [AppComponent]
})
export class AppModule { }

# Methods

`createChannel(key: string, data: any, isPermanent: boolean = false): void`
Create a new channel.

key: Unique identifier for the channel.
data: Initial data for the channel.
isPermanent: If true, the data will be encrypted and saved in localStorage.

`getChannelData(key: string): Observable`
Gets the current data by an Observable of the channel specified by the key.

key: Channel identifier.
Returns the data stored in the channel.

`updateChannelData(key: string, data: any): void`
Updates the data of the channel specified by the key.

key: Channel identifier.
data: New data to update in the channel.

`deleteChannel(key: string, permanent: boolean = false): void`
Delete the channel specified by the key.

key: Channel identifier.
permanent: If true, also removes data from localStorage.
