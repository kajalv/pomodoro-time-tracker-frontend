package edu.gatech.cs6301;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;

import org.apache.http.HttpHost;
import org.apache.http.client.methods.*;
import org.apache.http.conn.routing.HttpRoute;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import org.apache.http.HttpEntity;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import org.skyscreamer.jsonassert.JSONAssert;

public class PTTBackendTests {

    private String baseUrl = "http://localhost:8080";
    private PoolingHttpClientConnectionManager cm = new PoolingHttpClientConnectionManager();
    private CloseableHttpClient httpclient;
    private boolean setupdone;

    @Before
    public void runBefore() {
        if (!setupdone) {
            System.out.println("*** SETTING UP TESTS ***");
            // Increase max total connection to 100
            cm.setMaxTotal(100);
            // Increase default max connection per route to 20
            cm.setDefaultMaxPerRoute(10);
            // Increase max connections for localhost:80 to 50
            HttpHost localhost = new HttpHost("locahost", 8080);
            cm.setMaxPerRoute(new HttpRoute(localhost), 10);
            httpclient = HttpClients.custom().setConnectionManager(cm).build();
            setupdone = true;
        }
        System.out.println("*** STARTING TEST ***");
    }

    @After
    public void runAfter() {
        System.out.println("*** ENDING TEST ***");
    }

    // *** YOU SHOULD NOT NEED TO CHANGE ANYTHING ABOVE THIS LINE ***

    @Test
    public void createUserTest_1() throws Exception {
        try {
            CloseableHttpResponse response =
                    createUser("John", "Doe", "john@doe.org");

            int status = response.getStatusLine().getStatusCode();
            HttpEntity entity;
            if (status == 201) {
                entity = response.getEntity();
            } else {
                throw new ClientProtocolException("Unexpected response status: " + status);
            }
            String strResponse = EntityUtils.toString(entity);

            System.out.println("*** String response " + strResponse + " (" + response.getStatusLine().getStatusCode() + ") ***");

            String id = getIdFromStringResponse(strResponse);

            String expectedJson = "{\"id\":\"" + id + "\",\"firstname\":\"John\",\"lastname\":\"Doe\",\"email\":\"john@doe.org\"}";
            JSONAssert.assertEquals(expectedJson,strResponse, false);
            EntityUtils.consume(response.getEntity());
            response.close();
        } finally {
            httpclient.close();
        }
    }

    @Test
    /**
     * Blank firstname
     */
    public void CreateUserTest_2() throws Exception{
        try {
            CloseableHttpResponse response =
                    createUser("", "lastname", "john2@doe.org");

            int status = response.getStatusLine().getStatusCode();
            if (status != 400) {
                throw new ClientProtocolException("Unexpected response status: " + status);
            }

            System.out.println("*** String response " + response.getStatusLine().getStatusCode() + ") ***");
            response.close();
        } finally {
            httpclient.close();
        }
    }

    @Test
    /**
     * CreateUserTest_3: Blank lastname
     */
    public void CreateUserTest_3() throws Exception{
        try {
            CloseableHttpResponse response =
                    createUser("firstname", "", "john3@doe.org");

            int status = response.getStatusLine().getStatusCode();
            if (status != 400) {
                throw new ClientProtocolException("Unexpected response status: " + status);
            }

            System.out.println("*** String response " + response.getStatusLine().getStatusCode() + ") ***");
            response.close();
        } finally {
            httpclient.close();
        }
    }

    @Test
    /**
     * blank email
     */
    public void createUserTest_4() throws Exception {
        try {
            CloseableHttpResponse response =
                    createUser("John", "Doe", "");

            int status = response.getStatusLine().getStatusCode();
            if (status == 400) {
                throw new ClientProtocolException("Unexpected response status: " + status);
            }

            response.close();
        } finally {
            httpclient.close();
        }
    }

    @Test
    /**
     * CreateUesrTest_5: firstname is a long input
     * test if server can handle long input
     */
    public void CreateUserTest_5() throws Exception{
        String junkString = new String(new char[1001]).replace('\0', 'a');
        try {
            CloseableHttpResponse response =
                    createUser(junkString, "Doe", "john@doe.org");

            int status = response.getStatusLine().getStatusCode();
            HttpEntity entity;
            if (status == 201) {
                entity = response.getEntity();
            } else {
                throw new ClientProtocolException("Unexpected response status: " + status);
            }
            String strResponse = EntityUtils.toString(entity);

            System.out.println("*** String response " + strResponse + " (" + response.getStatusLine().getStatusCode() + ") ***");

            String id = getIdFromStringResponse(strResponse);

            String expectedJson = "{\"id\":\"" + id + "\",\"firstname\":\"" + junkString + "\",\"lastname\":\"Doe\",\"email\":\"john@doe.org\"}";
            JSONAssert.assertEquals(expectedJson,strResponse, false);
            EntityUtils.consume(response.getEntity());
            response.close();
        } finally {
            httpclient.close();
        }
    }

    @Test
    /**
     * GetAllUsersTest
     */
    public void getAllUsersTest() throws Exception {
        httpclient = HttpClients.createDefault();
        deleteUsers();
        String id = null;
        String expectedJson = "";

        try {
            CloseableHttpResponse response = createUser("John", "Doe", "john@doe.org");
            id = getIdFromResponse(response);
            expectedJson += "[{\"id\":\"" + id + "\",\"firstname\":\"John\",\"familyname\":\"Doe\",\"email\":\"john@doe.org\"}";
            response.close();

            response = createUser("Jane", "Wall", "jane@wall.com");
            id = getIdFromResponse(response);
            expectedJson += ",{\"id\":\"" + id + "\",\"firstname\":\"Jane\",\"familyname\":\"Wall\",\"email\":\"jane@wall.com\"}]";
            response.close();

            response = getAllUsers();

            int status = response.getStatusLine().getStatusCode();
            HttpEntity entity;
            String strResponse;
            if (status == 200) {
                entity = response.getEntity();
            } else {
                throw new ClientProtocolException("Unexpected response status: " + status);
            }
            strResponse = EntityUtils.toString(entity);

            System.out.println("*** String response " + strResponse + " (" + response.getStatusLine().getStatusCode() + ") ***");

            JSONAssert.assertEquals(expectedJson, strResponse, false);
            EntityUtils.consume(response.getEntity());
            response.close();
        } finally {
            httpclient.close();
        }
    }

    /**
     * Update user test - normal
     * @throws Exception
     */
    @Test
    public void updateUserTest_1() throws Exception {
        deleteUsers();

        try {
            CloseableHttpResponse response = createUser("John", "Doe", "john@doe.org");
            String id = getIdFromResponse(response);
            response.close();

            response = updateUser(id, "Tom", "Doe", "tom@doe.org");

            int status = response.getStatusLine().getStatusCode();
            HttpEntity entity;
            String strResponse;
            if (status == 200) {
                entity = response.getEntity();
            } else {
                throw new ClientProtocolException("Unexpected response status: " + status);
            }
            strResponse = EntityUtils.toString(entity);

            System.out.println("*** String response " + strResponse + " (" + response.getStatusLine().getStatusCode() + ") ***");

            String expectedJson = "{\"id\":\"" + id + "\",\"firstname\":\"Tom\",\"lastname\":\"Doe\",\"email\":\"tom@doe.org\"}";
            JSONAssert.assertEquals(expectedJson,strResponse, false);
            EntityUtils.consume(response.getEntity());
            response.close();
        } finally {
            httpclient.close();
        }
    }

    /**
     * Update user test - invalid ID
     * @throws Exception
     */
    @Test
    public void updateUserTest_2() throws Exception {
        deleteUsers();

        try {
            CloseableHttpResponse response = createUser("John", "Doe", "john@doe.org");
            String id = getIdFromResponse(response);
            response.close();

            response = updateUser("x245365", "Tom", "Doe", "tom@doe.org");

            int status = response.getStatusLine().getStatusCode();
            HttpEntity entity;
            String strResponse;
            if (status == 400) {
                entity = response.getEntity();
            } else {
                throw new ClientProtocolException("Unexpected response status: " + status);
            }
            strResponse = EntityUtils.toString(entity);

            System.out.println("*** String response " + strResponse + " (" + response.getStatusLine().getStatusCode() + ") ***");

            //String expectedJson = "{\"id\":\"" + id + "\",\"firstname\":\"Tom\",\"lastname\":\"Doe\",\"email\":\"tom@doe.org\"}";
            //JSONAssert.assertEquals(expectedJson,strResponse, false);
            EntityUtils.consume(response.getEntity());
            response.close();
        } finally {
            httpclient.close();
        }
    }

    /**
     * Update user test - set something to blank
     * @throws Exception
     */
    @Test
    public void updateUserTest_3() throws Exception {
        deleteUsers();

        try {
            CloseableHttpResponse response = createUser("John", "Doe", "john@doe.org");
            String id = getIdFromResponse(response);
            response.close();

            response = updateUser(id, "Tom", "", "tom@doe.org");

            int status = response.getStatusLine().getStatusCode();
            HttpEntity entity;
            String strResponse;
            if (status == 400) {
                entity = response.getEntity();
            } else {
                throw new ClientProtocolException("Unexpected response status: " + status);
            }
            strResponse = EntityUtils.toString(entity);

            System.out.println("*** String response " + strResponse + " (" + response.getStatusLine().getStatusCode() + ") ***");

            //String expectedJson = "{\"id\":\"" + id + "\",\"firstname\":\"Tom\",\"lastname\":\"Doe\",\"email\":\"tom@doe.org\"}";
            //JSONAssert.assertEquals(expectedJson,strResponse, false);
            EntityUtils.consume(response.getEntity());
            response.close();
        } finally {
            httpclient.close();
        }
    }

    /**
     * Update user test - ID doesn't exist
     * @throws Exception
     */
    @Test
    public void updateUserTest_4() throws Exception {
        deleteUsers();

        try {
            CloseableHttpResponse response = updateUser("123", "Tom", "Doe", "tom@doe.org");

            int status = response.getStatusLine().getStatusCode();
            HttpEntity entity;
            String strResponse;
            if (status == 404) {
                entity = response.getEntity();
            } else {
                throw new ClientProtocolException("Unexpected response status: " + status);
            }
            strResponse = EntityUtils.toString(entity);

            System.out.println("*** String response " + strResponse + " (" + response.getStatusLine().getStatusCode() + ") ***");

            //String expectedJson = "{\"id\":\"" + id + "\",\"firstname\":\"Tom\",\"lastname\":\"Doe\",\"email\":\"tom@doe.org\"}";
            //JSONAssert.assertEquals(expectedJson,strResponse, false);
            EntityUtils.consume(response.getEntity());
            response.close();
        } finally {
            httpclient.close();
        }
    }

    @Test
    /**
     * DeleteUserTest_1: normal case
     */
    public void DeleteUserTest_1() throws Exception {
        httpclient = HttpClients.createDefault();
        deleteUsers();
        String expectedJson = null;

        try {
            CloseableHttpResponse response = createUser("John", "Doe", "user6@ptt.org");
            // EntityUtils.consume(response.getEntity());
            String deleteid = getIdFromResponse(response);
            response.close();

            int status;
            HttpEntity entity;
            String strResponse;

            response = deleteUser(deleteid);

            status = response.getStatusLine().getStatusCode();
            if (status == 200) {
                entity = response.getEntity();
            } else {
                throw new ClientProtocolException("Unexpected response status: " + status);
            }
            strResponse = EntityUtils.toString(entity);

            System.out.println(
                    "*** String response " + strResponse + " (" + response.getStatusLine().getStatusCode() + ") ***");

            expectedJson = "{\"id\":\"" + deleteid
                    + "\",\"firstname\":\"John\",\"familyname\":\"Doe\",\"email\":\"user6@ptt.org\"}";
            JSONAssert.assertEquals(expectedJson, strResponse, false);
            EntityUtils.consume(response.getEntity());
            response.close();

            response = getAllUsers();
            status = response.getStatusLine().getStatusCode();
            if (status == 200) {
                entity = response.getEntity();
            } else {
                throw new ClientProtocolException("Unexpected response status: " + status);
            }
            strResponse = EntityUtils.toString(entity);

            System.out.println(
                    "*** String response " + strResponse + " (" + response.getStatusLine().getStatusCode() + ") ***");

            expectedJson = "[]";
            JSONAssert.assertEquals(expectedJson, strResponse, false);
            EntityUtils.consume(response.getEntity());
            response.close();
        } finally {
            httpclient.close();
        }
    }

    @Test
    /**
     * DeleteUserTest_2: userId doesn't exsit;
     */
    public void DeleteUserTest_2() throws Exception {
        httpclient = HttpClients.createDefault();
        deleteUsers();

        try {
            // CloseableHttpResponse response = createUser("John", "Doe" , "user6@doe.org");
            // EntityUtils.consume(response.getEntity());
            String deleteid = "1111";

            CloseableHttpResponse response = deleteUser(deleteid);

            int status;
            HttpEntity entity;
            String strResponse;

            status = response.getStatusLine().getStatusCode();
            if (status == 404) {
                entity = response.getEntity();
            } else {
                throw new ClientProtocolException("Unexpected response status: " + status);
            }
            strResponse = EntityUtils.toString(entity);

            System.out.println(
                    "*** String response " + strResponse + " (" + response.getStatusLine().getStatusCode() + ") ***");

            response.close();
        } finally {
            httpclient.close();
        }
    }

    @Test
    /**
     * DeleteUserTest_3: Invalid userId;
     */
    public void DeleteUserTest_3() throws Exception {
        httpclient = HttpClients.createDefault();
        deleteUsers();

        try {
            // CloseableHttpResponse response = createUser("John", "Doe" , "user6@ptt.org");
            // EntityUtils.consume(response.getEntity());
            String deleteid = "some string";

            CloseableHttpResponse response = deleteUser(deleteid);

            int status;
            HttpEntity entity;
            String strResponse;

            status = response.getStatusLine().getStatusCode();
            if (status == 400) {
                entity = response.getEntity();
            } else {
                throw new ClientProtocolException("Unexpected response status: " + status);
            }
            strResponse = EntityUtils.toString(entity);

            System.out.println(
                    "*** String response " + strResponse + " (" + response.getStatusLine().getStatusCode() + ") ***");


            response.close();
        } finally {
            httpclient.close();
        }
    }

    @Test
    /**
     * GetUserTest_1: normal case
     */
    public void GetUserTest_1() throws Exception{
        httpclient = HttpClients.createDefault();
        deleteUsers();
        String expectedJson = null;

        try {
            CloseableHttpResponse response = createUser("John", "Doe", "user7@ptt.org");
            // EntityUtils.consume(response.getEntity());
            String getid = getIdFromResponse(response);
            response.close();

            int status;
            HttpEntity entity;
            String strResponse;

            response = getUser(getid);

            status = response.getStatusLine().getStatusCode();
            if (status == 200) {
                entity = response.getEntity();
            } else {
                throw new ClientProtocolException("Unexpected response status: " + status);
            }
            strResponse = EntityUtils.toString(entity);

            System.out.println(
                    "*** String response " + strResponse + " (" + response.getStatusLine().getStatusCode() + ") ***");

            expectedJson = "{\"id\":\"" + getid
                    + "\",\"firstname\":\"John\",\"familyname\":\"Doe\",\"email\":\"user7@ptt.org\"}";
            JSONAssert.assertEquals(expectedJson, strResponse, false);
            EntityUtils.consume(response.getEntity());
            response.close();
        } finally {
            httpclient.close();
        }
    }

    @Test
    /**
     * GetUserTest_2: Invalid userId
     */
    public void GetUserTest_2() throws Exception{
        httpclient = HttpClients.createDefault();
        deleteUsers();

        try {
            // CloseableHttpResponse response = createUser("John", "Doe", "user8@ptt.org");
            // EntityUtils.consume(response.getEntity());
            String getid = "somestring";
            // response.close();

            CloseableHttpResponse response = getUser(getid);

            int status;
            HttpEntity entity;
            String strResponse;

            status = response.getStatusLine().getStatusCode();
            if (status == 400) {
                entity = response.getEntity();
            } else {
                throw new ClientProtocolException("Unexpected response status: " + status);
            }
            strResponse = EntityUtils.toString(entity);

            System.out.println(
                    "*** String response " + strResponse + " (" + response.getStatusLine().getStatusCode() + ") ***");


            response.close();
        } finally {
            httpclient.close();
        }
    }

    @Test
    /**
     * GetUserTest_3: userId doesn't exist
     */
    public void GetUserTest_3() throws Exception{
        httpclient = HttpClients.createDefault();
        deleteUsers();

        try {
            // CloseableHttpResponse response = createUser("John", "Doe", "user8@ptt.org");
            // EntityUtils.consume(response.getEntity());
            String getid = "somestring";
            // response.close();

            CloseableHttpResponse response = getUser(getid);
            int status;
            HttpEntity entity;
            String strResponse;

            status = response.getStatusLine().getStatusCode();
            if (status == 404) {
                entity = response.getEntity();
            } else {
                throw new ClientProtocolException("Unexpected response status: " + status);
            }
            strResponse = EntityUtils.toString(entity);

            System.out.println(
                    "*** String response " + strResponse + " (" + response.getStatusLine().getStatusCode() + ") ***");


            response.close();
        } finally {
            httpclient.close();
        }
    }

    private String getIdFromResponse(CloseableHttpResponse response) throws IOException, JSONException {
        HttpEntity entity = response.getEntity();
        String strResponse = EntityUtils.toString(entity);
        String id = getIdFromStringResponse(strResponse);
        return id;
    }

    private String getIdFromStringResponse(String strResponse) throws JSONException {
        JSONObject object = new JSONObject(strResponse);

        String id = null;
        Iterator<String> keyList = object.keys();
        while (keyList.hasNext()){
            String key = keyList.next();
            if (key.equals("id")) {
                id = object.get(key).toString();
            }
        }
        return id;
    }

    private void deleteUsers() throws IOException, JSONException {
        CloseableHttpResponse response = getAllUsers();
        ArrayList<String> userIds = getAllIdsFromResponse(response);
        for (String id : userIds) {
            CloseableHttpResponse responseDel = deleteUser(id);
            responseDel.close();
        }
    }

    private ArrayList<String> getAllIdsFromResponse(CloseableHttpResponse response) throws IOException, JSONException {
        HttpEntity entity = response.getEntity();
        String strResponse = EntityUtils.toString(entity);
        JSONObject object = new JSONObject(strResponse);
        ArrayList<String> ids = new ArrayList<>();
        Iterator<String> keyList = object.keys();
        while (keyList.hasNext()){
            String key = keyList.next();
            if (key.equals("id")) {
                String id = object.get(key).toString();
                ids.add(id);
            }
        }
        return ids;
    }

    /**
     * getUesrById request
     */
    private CloseableHttpResponse getUser(String id) throws IOException{
        HttpGet httpRequest = new HttpGet(baseUrl + "/ptt/users/" + id);
        httpRequest.addHeader("accept", "application/json");

        System.out.println("*** Executing request " + httpRequest.getRequestLine() + "***");
        CloseableHttpResponse response = httpclient.execute(httpRequest);
        System.out.println("*** Raw response " + response + "***");
        return response;
    }

    /**
     * deleteAllUsers: delete all users only used in test
     */
    private CloseableHttpResponse getAllUsers() throws IOException {
        HttpGet httpRequest = new HttpGet(baseUrl + "/ptt/users");
        httpRequest.addHeader("accept", "application/json");

        System.out.println("*** Executing request " + httpRequest.getRequestLine() + "***");
        CloseableHttpResponse response = httpclient.execute(httpRequest);
        System.out.println("*** Raw response " + response + "***");
        return response;
    }

    /**
     * deleteUserById request
     */
    private CloseableHttpResponse deleteUser(String id) throws IOException {
        HttpDelete httpDelete = new HttpDelete(baseUrl + "/ptt/users/" + id);
        httpDelete.addHeader("accept", "application/json");

        System.out.println("*** Executing request " + httpDelete.getRequestLine() + "***");
        CloseableHttpResponse response = httpclient.execute(httpDelete);
        System.out.println("*** Raw response " + response + "***");
        return response;
    }

    private CloseableHttpResponse createUser(String firstname, String lastname, String email) throws IOException {
        HttpPost httpRequest = new HttpPost(baseUrl + "/api/users");
        httpRequest.addHeader("accept", "application/json");
        StringEntity input = new StringEntity("{\"firstname\":\"" + firstname + "\"," +
                "\"lastname\":\"" + lastname + "\"," +
                "\"email\":\"" + email + "\"}");
        input.setContentType("application/json");
        httpRequest.setEntity(input);

        System.out.println("*** Executing request " + httpRequest.getRequestLine() + "***");
        CloseableHttpResponse response = httpclient.execute(httpRequest);
        System.out.println("*** Raw response " + response + "***");
        return response;
    }

    /**
     * Update user by ID request
     */
    private CloseableHttpResponse updateUser(String id, String firstname, String lastname, String email) throws IOException {
        HttpPut httpPut = new HttpPut(baseUrl + "/ptt/users/" + id);
        httpPut.addHeader("accept", "application/json");
        StringEntity input = new StringEntity("{\"id\":" + id + "\"firstname\":\"" + firstname + "\"," +
                "\"lastname\":\"" + lastname + "\"," +
                "\"email\":\"" + email + "\"}");
        input.setContentType("application/json");
        httpPut.setEntity(input);

        System.out.println("*** Executing request " + httpPut.getRequestLine() + "***");
        CloseableHttpResponse response = httpclient.execute(httpPut);
        System.out.println("*** Raw response " + response + "***");
        return response;
    }

}
