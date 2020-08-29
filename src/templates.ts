export const GOLANG_BASE = `
type Client struct {
	*http.Client
	Url string
}

// NewClient creates a GraphQL client ready to use.
func NewClient(url string) *Client {
	return &Client{
		Client: &http.Client{},
		Url:    url,
	}
}

type GraphQLOperation struct {
	Query         string                 \`json:"query"\`
	OperationName string                 \`json:"operationName,omitempty"\`
	Variables     json.RawMessage        \`json:"variables,omitempty"\`
}

type GraphQLResponse struct {
	Data   json.RawMessage \`json:"data,omitempty"\`
	Errors []GraphQLError  \`json:"errors,omitempty"\`
}

type GraphQLError map[string]interface{}

func (err GraphQLError) Error() string {
	return fmt.Sprintf("graphql: %v", map[string]interface{}(err))
}

func (resp *GraphQLResponse) Error() string {
	if len(resp.Errors) == 0 {
		return ""
	}
	errs := strings.Builder{}
	for _, err := range resp.Errors {
		errs.WriteString(err.Error())
		errs.WriteString("\\n")
	}
	return errs.String()
}

func execute(client *http.Client, req *http.Request) (*GraphQLResponse, error) {
	if client == nil {
		client = http.DefaultClient
	}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	body, err := ioutil.ReadAll(resp.Body)
	resp.Body.Close()
	if err != nil {
		return nil, err
	}
	return unmarshalGraphQLReponse(body)
}

func unmarshalGraphQLReponse(b []byte) (*GraphQLResponse, error) {
	resp := GraphQLResponse{}
	if err := json.Unmarshal(b, &resp); err != nil {
		return nil, err
	}
	if len(resp.Errors) > 0 {
		return &resp, &resp
	}
	return &resp, nil
}
`

export const GOLANG_OPERATION = `
type {{name}}Request struct {
  *http.Request
}

{% if hasVariables -%}
func New{{name}}Request(url string, vars *{{name}}Variables) (*{{name}}Request, error) {
  variables, err := json.Marshal(vars)
  if err != nil {
    return nil, err
  }
  b, err := json.Marshal(&GraphQLOperation{
    Variables: variables,
{%- else %}
func New{{name}}Request(url string) (*{{name}}Request, error) {
  b, err := json.Marshal(&GraphQLOperation{
{%- endif %}
    Query: \`{{operation}}\`,
  })
  if err != nil {
    return nil, err
  }
  req, err := http.NewRequest(http.MethodPost, url, bytes.NewReader(b))
  if err != nil {
    return nil, err
  }
  req.Header.Set("Content-Type", "application/json")
  return &{{name}}Request{req}, nil
}

func (req *{{name}}Request) Execute(client *http.Client) (*{{name}}Response, error) {
  resp, err := execute(client, req.Request)
  if err != nil {
    return nil, err
  }
  var result {{name}}Response
  if err := json.Unmarshal(resp.Data, &result); err != nil {
    return nil, err
  }
return &result, nil
}

{% if hasVariables -%}
func {{name}}(url string, client *http.Client, vars *{{name}}Variables) (*{{name}}Response, error) {
  req, err := New{{name}}Request(url, vars)
{%- else %}
func {{name}}(url string, client *http.Client) (*{{name}}Response, error) {
  req, err := New{{name}}Request(url)
{%- endif %}
  if err != nil {
    return nil, err
  }
  return req.Execute(client)
}

{% if hasVariables -%}
func (client *Client) {{name}}(vars *{{name}}Variables) (*{{name}}Response, error) {
  return {{name}}(client.Url, client.Client, vars)
{%- else %}
func (client *Client) {{name}}() (*{{name}}Response, error) {
  return {{name}}(client.Url, client.Client)
{%- endif %}
}
`
